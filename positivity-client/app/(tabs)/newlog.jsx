import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
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
    const setLogs = useContext(AppContext).setLogs

    function isLogAllowed() {
        if (logs.length === 0) return true;
        const now = DateTime.now().toLocal().startOf("day");
        const last_log_completed = DateTime.fromISO(logs[logs.length - 1].createdAt).toLocal().startOf("day");
        const diff = now.diff(last_log_completed, ["days", "hours"]).days;
        return diff >= 1;
    }

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
            draft.push({"createdAt": new Date(), "title": logTitle.trim(), "content": logText.trim()})
        })
        setLogs(newLogsDraft);
        AsyncStorage.setItem('logs', JSON.stringify(newLogsDraft));
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