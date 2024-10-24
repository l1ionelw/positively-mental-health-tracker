import React, {useContext, useState} from "react";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AppContext} from "../../context/AppContext";

export default function App() {
    const [surveyState, setSurveyState] = useState("Incomplete");
    const surveys = useContext(AppContext).surveys;

    function startSurvey(rating) {
        console.log("chose number: " + rating)
    }

    function isSurveyComplete() {
        // get survey state
        // get last json time
        // check if it is same as today
    }

    return (
        <SafeAreaView>
            <Text style={styles.headers}>POSITIVELY</Text>
            {surveyState === "Incomplete" &&
                <View style={styles.container}>
                    <View style={{marginLeft: 10, marginRight: 10}}>
                        <Text style={{alignSelf: "center", marginBottom: 20, marginTop: 10}}>How are you feeling
                            today?</Text>
                        <ScrollView horizontal={true}>
                            {[...Array(10)].map((x, i) => (
                                <TouchableOpacity key={i + 1} style={styles.button}
                                                  onPress={() => startSurvey(i + 1)}><Text>{i + 1}</Text></TouchableOpacity>
                            ))}
                        </ScrollView>
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
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 60,
        backgroundColor: "#476eca",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    container: {
        alignSelf: "center",
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        width: Dimensions.get("window").width / 1.3,
        backgroundColor: "#b5b5b5",
        borderRadius: 10
    }
})
