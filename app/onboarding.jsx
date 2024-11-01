import React, {SafeAreaView, TextInput, View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import {useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AppContext} from "../context/AppContext";
import {Colors} from "../constants/Colors";

export default function Onboarding({setFirstAppLaunch}) {
    const [step, setStep] = useState("Welcome");
    const [name, setName] = useState("");

    function submitName() {
        if (name.trim().length === 0) return;
        const newData = {"name": name.trim()}
        const userInfo = JSON.stringify(newData);
        AsyncStorage.setItem("userInfo", userInfo).then(() => {
            setFirstAppLaunch(false);
        });
    }

    return (
        <SafeAreaView style={styles.centered}>
            {step === "Welcome" && <View>
                <Text style={styles.header}> Welcome to</Text>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 40,
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 10,
                }}>Positively</Text>
                <TouchableOpacity onPress={() => setStep("Enter Name")}
                                  style={styles.submitButton}><Text>Start</Text></TouchableOpacity>
            </View>}
            {step === "Enter Name" && (
                <View>
                    <Text style={styles.paragraph}> What should we call you?</Text>
                    <TextInput style={styles.textbox} placeholderTextColor="#c1c1c1" placeholder="Mary Poppins..."
                               onChangeText={(e) => setName(e)}></TextInput>
                    <TouchableOpacity style={styles.submitButton}
                                      onPress={submitName}><Text>Done</Text></TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Dimensions.get("window").height / 4,
        backgroundColor: "#fff"
    },
    header: {
        fontSize: 40,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    paragraph: {
        marginBottom: 20,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        width: 300,
        height: 350,
        alignSelf: 'center',
    },
    textbox: {
        backgroundColor: '#EEEEEE',
        borderRadius: 12.5,
        height: 50,
        fontSize: 20,
        padding: 10,
        margin: 15,
        color: "#000"
    },
    submitButton: {
        backgroundColor: '#7E8D69',
        alignSelf: 'center',
        paddingHorizontal: 45,
        paddingVertical: 16,
        borderRadius: 5,
    },
})