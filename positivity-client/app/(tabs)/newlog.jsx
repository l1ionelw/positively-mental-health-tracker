import {Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import React, {useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DateTime} from "luxon";
import {AppContext} from "../../context/AppContext";
import {produce} from "immer";

export default function NewLog() {
    const [logText, setLogText] = useState("");
    const [logTitle, setLogTitle] = useState("");
    const [error, setError] = useState("");
    const logs = useContext(AppContext).logs;
    const setLogs = useContext(AppContext).setLogs;

    function isLogAllowed() {
        if (logs.length === 0) return true;
        const now = DateTime.now().toLocal().startOf("day");
        const last_log_completed = DateTime.fromISO(logs[logs.length - 1].createdAt).toLocal().startOf("day");
        const diff = now.diff(last_log_completed, ["days", "hours"]).days;
        return diff >= 1;
    }

    let exampleLogs = [
        {
            "createdAt": "2024-10-24T06:49:14.838222",
            "title": "Daily Reflection",
            "content": "Today I played basketball. The recipe I tried turned out surprisingly well! I had fun experimenting with new ingredients, and the flavors blended perfectly. I learned the importance of precision and patience in cooking."
        },
        {
            "createdAt": "2024-10-24T17:51:14.838222",
            "title": "Daily Reflection",
            "content": "Today I met up with old friends. Swimming was refreshing and challenging at the same time. I focused on improving my stroke techniques and pacing myself better. It felt rewarding to finish more laps than I expected."
        },
        {
            "createdAt": "2024-10-24T17:05:14.838222",
            "title": "Daily Reflection",
            "content": "Today I tried a new recipe. The concert was exhilarating. The energy of the crowd, combined with the amazing performance, made me forget about everything else. I left feeling inspired and creatively energized."
        },
        {
            "createdAt": "2024-10-24T05:40:14.838222",
            "title": "Daily Reflection",
            "content": "Today I went swimming. Painting the landscape took longer than I expected, but the process was therapeutic. Each brushstroke allowed me to focus on details I hadn’t noticed before. It gave me a sense of peace."
        },
        {
            "createdAt": "2024-10-24T07:45:14.838222",
            "title": "Daily Reflection",
            "content": "Today I read a book. Painting the landscape took longer than I expected, but the process was therapeutic. Each brushstroke allowed me to focus on details I hadn’t noticed before. It gave me a sense of peace."
        },
        {
            "createdAt": "2024-10-24T09:16:14.838222",
            "title": "Daily Reflection",
            "content": "Today I went to a concert. Painting the landscape took longer than I expected, but the process was therapeutic. Each brushstroke allowed me to focus on details I hadn’t noticed before. It gave me a sense of peace."
        },
        {
            "createdAt": "2024-10-24T08:48:14.838222",
            "title": "Daily Reflection",
            "content": "Today I tried a new recipe. I finally finished reading that book I’d been putting off for months. The story was captivating, and I got completely lost in it. It gave me a fresh perspective on life and relationships."
        },
        {
            "createdAt": "2024-10-24T07:09:14.838222",
            "title": "Daily Reflection",
            "content": "Today I tried a new recipe. Building the robot was an intricate process, but seeing it move according to my programming was incredibly satisfying. It was a reminder of how much I enjoy creating things from scratch."
        },
        {
            "createdAt": "2024-10-24T10:16:14.838222",
            "title": "Daily Reflection",
            "content": "Today I met up with old friends. The recipe I tried turned out surprisingly well! I had fun experimenting with new ingredients, and the flavors blended perfectly. I learned the importance of precision and patience in cooking."
        },
        {
            "createdAt": "2024-10-24T18:34:14.838222",
            "title": "Daily Reflection",
            "content": "Today I studied for my exam. Hiking was absolutely breathtaking. The view from the top of the mountain was worth the effort. I had a chance to reflect on my goals while enjoying nature."
        }
    ];



    function submitLog() {
        if (!logTitle) {
            setError("Your title is missing");
            return;
        }
        if (!isLogAllowed()) {
            setError("You've already created a log today");
            return
        }
        const newLogsDraft = produce(logs, draft => {
            draft.push({"createdAt": DateTime.now().toLocal().toISO(), "title": logTitle.trim(), "content": logText.trim()})
        })
        setLogs(newLogsDraft);
        AsyncStorage.setItem('logs', JSON.stringify(newLogsDraft));
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView>
            <Text style={styles.header}>Reflect on your day</Text>
            <TextInput style={styles.titleBox} onChangeText={(text) => {
                setLogTitle(text)
            }} placeholder="Enter your log's title here..."></TextInput>
            <TextInput style={styles.textbox} onChangeText={(text) => {
                setLogText(text)
            }} placeholder="Enter your log here..." multiline={true}></TextInput>
            <TouchableOpacity style={isLogAllowed() ? styles.submitButton : styles.submitButtonDisabled}
                              onPress={submitLog}><Text>Submit</Text></TouchableOpacity>
            <Text style={styles.error}>{error}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    submitButton: {
        backgroundColor: '#7E8D69',
        alignSelf: 'center',
        paddingHorizontal: 45,
        paddingVertical: 16,
        borderRadius: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#b3b3b3',
        alignSelf: 'center',
        paddingHorizontal: 45,
        paddingVertical: 16,
        borderRadius: 5,
    },
    titleBox: {
        backgroundColor: '#EEEEEE',
        borderRadius: 12.5,
        height: 50,
        fontSize: 20,
        padding: 10,
        margin: 5,
        fontWeight: "bold"
    },

    textbox: {
        backgroundColor: '#EEEEEE',
        borderRadius: 18,
        height: 200,
        fontSize: 16,
        padding: 10,
        margin: 5,
    },
    header: {
        fontSize: 40,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    error: {
        alignSelf: "center",
    }
})