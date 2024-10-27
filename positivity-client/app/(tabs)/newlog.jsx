import {
    Dimensions,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, View
} from "react-native";
import React, {useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DateTime} from "luxon";
import {AppContext} from "../../context/AppContext";
import {produce} from "immer";
import {Colors} from "../../constants/Colors";

export default function NewLog() {
    const [logText, setLogText] = useState("");
    const [logTitle, setLogTitle] = useState("");
    const [error, setError] = useState("");
    const logs = useContext(AppContext).logs;
    const setLogs = useContext(AppContext).setLogs;

    const darkMode = useContext(AppContext).userInfo.darkMode;

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
            borderRadius: 12.5,
            height: 50,
            fontSize: 20,
            padding: 10,
            margin: 5,
            fontWeight: "bold"
        },

        textbox: {
            borderRadius: 18,
            height: 200,
            fontSize: 16,
            padding: 10,
            margin: 5,
            backgroundColor: darkMode ? Colors.dark.widgetBackground : Colors.light.widgetBackground,
        },
        header: {
            fontSize: 34.23,
            fontWeight: "bold",
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10,
            color: (darkMode)?Colors.dark.text : Colors.light.text,
        },
        error: {
            alignSelf: "center",
        },
        viewMargins: {
            marginTop: 60,
            marginLeft: 30,
            marginRight: 30,
        }
    })

    const textInputColorStyle = {
        color: darkMode ? Colors.dark.text : Colors.light.text,
        backgroundColor: darkMode ? Colors.dark.widgetBackground : Colors.light.widgetBackground,
    };

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
            draft.push({"createdAt": DateTime.now().toLocal().toISO(), "title": logTitle.trim(), "content": logText.trim()})
        })
        setLogs(newLogsDraft);
        AsyncStorage.setItem('logs', JSON.stringify(newLogsDraft));
        Keyboard.dismiss();
    }

    return (
        <View style = {{backgroundColor: (darkMode)?Colors.dark.background : Colors.light.background,}}>
        <SafeAreaView style={styles.viewMargins}>
            <ScrollView keyboardDismissMode={"on-drag"} style={{height: Dimensions.get("window").height}}>
                <Text style={styles.header}>Reflect on your day</Text>
                <TextInput placeholderTextColor={(!darkMode) ? "#c1c1c1":"#fff"} style={[styles.titleBox, textInputColorStyle]} onChangeText={(text) => {
                    setLogTitle(text)
                }} placeholder="Enter your log's title here..."></TextInput>
                <TextInput placeholderTextColor={(!darkMode) ? "#c1c1c1":"#fff"}  style={styles.textbox} onChangeText={(text) => {
                    setLogText(text)
                }} placeholder="Enter your log here..."multiline={true}></TextInput>
                <TouchableOpacity style={isLogAllowed() ? styles.submitButton : styles.submitButtonDisabled}
                                  onPress={submitLog}><Text style = {{color: (darkMode)?Colors.dark.text : Colors.light.text}}>Submit</Text></TouchableOpacity>
                <Text style={styles.error}>{error}</Text>
            </ScrollView>
        </SafeAreaView>
        </View>
    )
}
