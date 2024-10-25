import React, {useContext} from "react";
import {SafeAreaView, Text, TouchableOpacity, View, Image, BackHandler, ScrollView} from "react-native";
import {StyleSheet, Alert} from 'react-native';
import {AppContext} from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {


    const userInfo = useContext(AppContext).userInfo;
    const setUserInfo = useContext(AppContext).setUserInfo;

    function clearAll() {
        AsyncStorage.clear().then(r => console.log("storage cleared!"));
        BackHandler.exitApp();
    }

    function changeName() {
        Alert.prompt("Change your name",
            "What should we call you?", [{text: "Cancel", style: "cancel"}, {
                text: "Confirm",
                onPress: newName => handleChangeName(newName)
            }])
    }

    function handleChangeName(newName) {
        const newInfo = {"name": newName}
        AsyncStorage.setItem("userInfo", JSON.stringify(newInfo))
        setUserInfo(newInfo)
    }

    return (
        <ScrollView>
        <SafeAreaView style={styles.viewMargins}>
            <Text style={styles.header}>Settings</Text>
            <Text style={styles.headerSecondary}>Profile</Text>
            <View style={styles.container}>
                <View style={styles.circle}></View>
                <Text style={{alignItems: "center", marginTop: 20}}>{userInfo.name}</Text>
                <View style={{flexGrow: 1}}></View>
                <TouchableOpacity style={styles.button} onPress={changeName}><Text
                    style={{marginTop: 8, alignSelf: "center"}}>Edit</Text></TouchableOpacity>
            </View>
            <Text style={styles.headerSecondary}>Theme</Text>
            <View style={styles.container}>
                <Text style={{alignItems: "center", marginTop: 20, marginBottom: 20}}>Light Mode</Text>
                <View style={{
                    marginTop: 4,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginBottom: 4,
                    flexDirection: "row",
                    backgroundColor: "#A1A1A1",
                    borderRadius: 10,
                    gap: 20,
                    marginLeft: 90
                }}>
                    <View style={{backgroundColor: "#9ECBFF", padding: 5, borderRadius: 5}}>
                        <Image style={{width: 25, height: 25}} source={require('../../assets/images/sunny.png')}/>
                    </View>
                    <View style={{padding: 5}}>
                        <Image style={{width: 25, height: 25}}
                               source={require('../../assets/images/moon-outline.png')}/>
                    </View>
                </View>
            </View>
            <Text style={styles.headerSecondary}>Notifications</Text>
            <View style={styles.container}>
                <Text style={{alignItems: "center", marginTop: 20, paddingBottom: 20}}>3 Notifications/day</Text>
                <View style={{flexGrow: 1}}></View>
                <TouchableOpacity style={styles.button}><Text
                    style={{marginTop: 8, alignSelf: "center"}}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={{
                    alignItems: "center",
                    marginTop: 5,
                    paddingBottom: 20,
                    fontSize: 16
                }}>Notifications:{"\n"}{"\n"}10 AM{"\n"}{"\n"}3 PM{"\n"}{"\n"}8 PM</Text>
                <View style={{flexGrow: 1}}></View>
            </View>
            <TouchableOpacity onPress={clearAll}><Text>Clear all data</Text></TouchableOpacity>
        </SafeAreaView>
        </ScrollView>
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
    },
    headerSecondary: {
        marginTop: 10,
        fontSize: 17,
    },
    container: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#D9D9D9",
        flexDirection: "row",
        borderRadius: 10,
        gap: 20
    },
    circle: {
        backgroundColor: "#D66A6A",
        borderRadius: 50,
        width: 60,
        height: 60
    },
    button: {
        backgroundColor: "#9ECBFF",
        borderRadius: 50,
        width: 70,
        height: 35,
        marginTop: 10
    }
})