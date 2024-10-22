import React, {useState} from "react";
import {TextInput, TouchableOpacity, Text, SafeAreaView} from "react-native";
import {API_URL} from "@/constants/Constants";

export default function HomeScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submit() {
        setEmail(email.trim());
        setPassword(password.trim());
        fetch(`${API_URL}/api/signup`, {
            method: "POST",
            body: JSON.stringify({"email": email, "password": password})
        }).then((r) => {
            console.log(r.status);
            r.json().then((json => console.log(json)));
        })
    }

    return (
        <SafeAreaView>
            <TextInput style={{color: "lightgray", marginTop: 40}} placeholder={"Email..."}
                       onChangeText={(e) => setEmail(e)}/>
            <TextInput style={{color: "lightgray"}} placeholder={"Password..."} secureTextEntry={true}
                       onChangeText={(e) => setPassword(e)}/>
            <TouchableOpacity onPress={submit}>
                <Text style={{color: '#FFFFFF'}}>Register</Text>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', color: "lightgray", marginTop: 50}}>Already have an account?</Text>
            <TouchableOpacity>
                <Text style={{textAlign: 'center', color: '#00BFFF'}}>
                    Log in!
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

