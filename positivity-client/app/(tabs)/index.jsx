import React, {useContext, useState} from "react";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AppContext} from "../../context/AppContext";
import {DateTime} from "luxon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {produce} from "immer";

export default function App() {
    const [surveyState, setSurveyState] = useState("Incomplete");
    const surveys = useContext(AppContext).surveys;
    const setSurveys = useContext(AppContext).setSurveys
    const [submitted, setSubmitted] = useState(-1);

    function submitSurvey(rating) {
        const newScoresDraft = produce(surveys, draft => {
            draft.push(rating)
        })
        AsyncStorage.setItem('surveys', JSON.stringify(newScoresDraft));
        setSubmitted(rating);
        setSurveys(newScoresDraft);
    }

    return (
        <SafeAreaView>
            <Text style={styles.headers}>POSITIVELY</Text>
            <Text>Welcome </Text>
            {surveyState === "Incomplete" &&
                <View style={styles.container}>
                    <View style={{marginLeft: 10, marginRight: 10}}>
                        <Text style={{alignSelf: "center", marginBottom: 20, marginTop: 10}}>How are you feeling
                            today?</Text>
                        <View style = {styles.row}>
                            {[...Array(5)].map((x, i) => (
                                <TouchableOpacity key={i + 1} style={(i+1 === submitted) ? styles.submittedButton : styles.button} onPress = {()=>{
                                    submitSurvey(i+1);
                                }}><Text>{i + 1}</Text></TouchableOpacity>
                            ))}
                        </View>
                        <View style = {styles.row}>
                            {[...Array(4)].map((x, i) => (
                                <TouchableOpacity key={i + 6} style={(i+6 === submitted) ? styles.submittedButton : styles.button} onPress = {()=>{
                                    submitSurvey(i+6);
                                }}><Text>{i + 6}</Text></TouchableOpacity>
                            ))}
                            <TouchableOpacity key={10} style={styles.tenButton}
                                              onPress={() => startSurvey(10)}><Text>{10}</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>}

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    headers: {
        alignSelf: "center",
        marginTop: 10,
        fontSize: 20,
        fontWeight: "bold"
    },
    button: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 24.5,
        paddingRight: 24.5,
        borderRadius: 70,
        backgroundColor: "#476eca",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10
    },
    tenButton: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20.5,
        paddingRight: 20.5,
        borderRadius: 70,
        backgroundColor: "#476eca",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10
    },
    container: {
        alignSelf: "center",
        marginBottom: 10,
        width: Dimensions.get("window").width / 1.1,
        backgroundColor: "#e6e6e6",
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    submittedButton:{
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 24.5,
        paddingRight: 24.5,
        borderRadius: 70,
        backgroundColor: "#f13939",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    }
})
