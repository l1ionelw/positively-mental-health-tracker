import {SafeAreaView, Text, View} from "react-native";
import React, {useContext} from "react";
import {AppContext} from "../../context/AppContext";

export default function Records() {
    const logs = useContext(AppContext).logs;
    if (logs.length === 0) {
        return (<Text style={{fontSize: 40}}>No logs</Text>)
    }

    return (
        <SafeAreaView>
            <Text>Records</Text>
            {logs.map((item) => (
                <View key={item.createdAt.toString()}>
                    <Text>{item.createdAt.toString()}</Text>
                    <Text>{item.title}</Text>
                    <Text>{item.content}</Text>
                </View>
            ))}
        </SafeAreaView>
    )
}