import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import luxon, {DateTime} from "luxon";

export default function NewLog() {
    const [logText, setLogText] = useState("");
    const [logTitle, setLogTitle] = useState("");
    const [submitButtonEnable, setSubmitButtonEnable] = useState(isLogAllowed);

    function onLoad(){
        
    }

    function isLogAllowed() {
        let logs: any = []
        AsyncStorage.getItem("logs").then((result) => {
            if (result !== null) {
                logs = JSON.parse(result);
            }
            const now = DateTime.now().startOf("day");
            const last_log_completed = DateTime.fromJSDate(logs[logs.length - 1]).startOf("day");
            const diff = now.diff(last_log_completed, ["days", "hours"]).days;
            return diff >= 1;
        });
    }

    function submitLog() {
        let logs: any = [];
        AsyncStorage.getItem("logs").then((result) => {
            if (result !== null) {
                logs = JSON.parse(result);
            }
            console.log(logs);
            logs.push({"createdAt": new Date(), "title": logTitle.trim(), "content": logText.trim()})
            AsyncStorage.setItem("logs", JSON.stringify(logs)).then((e) => {
                console.log("New data: ");
                console.log(logs);
            });
        });
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
            <TouchableOpacity style={styles.submitButton} onPress={submitLog}><Text>Submit</Text></TouchableOpacity>
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
        hidden
    },
})