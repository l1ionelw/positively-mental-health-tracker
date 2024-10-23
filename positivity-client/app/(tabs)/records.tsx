import {SafeAreaView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Records() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        AsyncStorage.getItem('logs').then((result) => {
            if (result !== null) {
                setLogs(JSON.parse(result));
            }
        });
    }, []);
    console.log(logs);
    if (logs.length === 0) {
        return (<Text style={{fontSize: 40}}>No logs</Text>)
    }

    return (
        <SafeAreaView>
            <Text>Records</Text>
            {logs.map((item) => (
                <View key={item.createdAt}>
                    <Text>{item.createdAt}</Text>
                    <Text>{item.title}</Text>
                    <Text>{item.content}</Text>
                </View>
            ))}
        </SafeAreaView>
    )
}