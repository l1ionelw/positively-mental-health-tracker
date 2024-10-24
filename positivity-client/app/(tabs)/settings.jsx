import React from "react";
import {SafeAreaView, Text} from "react-native";
import {StyleSheet} from 'react-native';

export default function Settings() {
    return (
        <SafeAreaView style={styles.viewMargins}>
            <Text style={styles.header}>Settings</Text>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    viewMargins: {
        marginTop: 60,
        marginLeft: 30,
        marginRight: 30
    },
    header: {
        fontSize: 40,
        fontWeight: "bold",
    }
})