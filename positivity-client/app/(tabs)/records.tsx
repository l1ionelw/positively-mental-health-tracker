import {SafeAreaView, Text, View} from "react-native";
import React, {useContext} from "react";
import {LogsContext} from "@/context/LogsContext";

export default function Records() {
    const logs = useContext(LogsContext).logs;
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