import React, {useContext, useState} from "react";
import {SafeAreaView, Text, TouchableOpacity, View, Image, BackHandler, ScrollView} from "react-native";
import {StyleSheet, Alert} from 'react-native';
import {AppContext} from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Colors} from "../../constants/Colors";
import * as Notifications from "expo-notifications";

export default function Settings() {

    const userInfo = useContext(AppContext).userInfo;
    const setUserInfo = useContext(AppContext).setUserInfo;
    const notificationPermission = useContext(AppContext).notificationPermission;
    const [darkMode, setDarkMode] = useState(userInfo['darkMode']);

    const styles = StyleSheet.create({
        viewMargins: {
            marginTop: 60,
            marginLeft: 30,
            marginRight: 30,
        },
        header: {
            fontSize: 40,
            fontWeight: "bold",
            color: (darkMode)?Colors.dark.text: Colors.light.text
        },
        headerSecondary: {
            marginTop: 10,
            fontSize: 17,
            color:(darkMode)?Colors.dark.text: Colors.light.text,
        },
        container: {
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground,
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
        },
        text:{
            color: (darkMode)?Colors.dark.text: Colors.light.text
        }
    })

    async function schedulePushNotification() {
        console.log("post push notification");
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Example Notification 🔔",
                body: 'This is our example notification',
            },
            trigger: null,
        }).catch((err)=>console.log(err));
    }

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
        const newInfo = {"name": newName, "darkMode": darkMode}
        AsyncStorage.setItem("userInfo", JSON.stringify(newInfo))
        setUserInfo(newInfo)
    }
    function handleNewDarkMode(newDarkMode){
        const newInfo = {"name": userInfo["name"], "darkMode": newDarkMode}
        setDarkMode(newDarkMode);
        AsyncStorage.setItem("userInfo", JSON.stringify(newInfo));
        setUserInfo(newInfo);
    }

    return (
        <ScrollView style = {{backgroundColor: (darkMode)?Colors.dark.background: Colors.light.background}}>
        <SafeAreaView style={styles.viewMargins}>
            <Text style={styles.header}>Settings</Text>
            <Text style={styles.headerSecondary}>Profile</Text>
            <View style={styles.container}>
                <View style={styles.circle}></View>
                <Text style={{alignItems: "center", marginTop: 20, color: (darkMode)?Colors.dark.text: Colors.light.text}}>{userInfo.name}</Text>
                <View style={{flexGrow: 1}}></View>
                <TouchableOpacity style={styles.button} onPress={changeName}><Text
                    style={{marginTop: 8, alignSelf: "center"}}>Edit</Text></TouchableOpacity>
            </View>
            <Text style={styles.headerSecondary}>Display</Text>
            <View style={styles.container}>
                <Text style={{alignItems: "center", marginTop: 20, marginBottom: 20, color: (darkMode)?Colors.dark.text: Colors.light.text}}>{(darkMode)?"Dark Mode":"Light Mode"}</Text>
                <View style={{
                    marginTop: 4,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginBottom: 4,
                    flexDirection: "row",
                    backgroundColor: (!darkMode)?"#A1A1A1":"#434343",
                    borderRadius: 10,
                    gap: 20,
                    marginLeft: 90
                }}>
                    <View style={{backgroundColor: (!darkMode)?"#9ECBFF":null, padding: 5, borderRadius: 5}}>
                        <TouchableOpacity onPress = {()=>handleNewDarkMode(false)}>
                        <Image style={{width: 25, height: 25, tintColor: (darkMode)?Colors.dark.tabIconDefault:null}}
                                source={(!darkMode)?require('../../assets/images/sunny.png'):require('../../assets/images/sunny-outline.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 5, backgroundColor: (darkMode)?"#9ECBFF":"#A1A1A1", borderRadius: 5}}>
                        <TouchableOpacity onPress = {()=>handleNewDarkMode(true)}>
                        <Image style={{width: 25, height: 25, tintColor: (darkMode)?Colors.dark.tabIconSelected:null}}
                               source={(!darkMode)?require('../../assets/images/moon-outline.png'):require("../../assets/images/moon.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={styles.headerSecondary}>Notifications</Text>
            <View style={styles.container}>
                <Text style={{alignItems: "center", marginTop: 20, paddingBottom: 20, color: (darkMode)?Colors.dark.text: Colors.light.text}}>3 Notifications/day</Text>
                <View style={{flexGrow: 1}}></View>
                <TouchableOpacity style={styles.button}><Text
                    style={{marginTop: 8, alignSelf: "center"}}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={{
                    alignItems: "center",
                    marginTop: 5,
                    paddingBottom: 20,
                    fontSize: 16,
                    color: (darkMode)?Colors.dark.text: Colors.light.text
                }}>Notifications:{"\n"}{"\n"}10 AM{"\n"}{"\n"}3 PM{"\n"}{"\n"}8 PM</Text>
                <View style={{flexGrow: 1}}></View>
            </View>
            <TouchableOpacity onPress={clearAll}><Text style = {styles.text}>Clear all data</Text></TouchableOpacity>
            <TouchableOpacity onPress={schedulePushNotification}><Text style = {styles.text}>Send post notification</Text></TouchableOpacity>
        </SafeAreaView>
        </ScrollView>
    )
}

