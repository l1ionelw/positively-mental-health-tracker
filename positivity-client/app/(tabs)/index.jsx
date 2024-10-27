import React, {useContext, useEffect, useState} from "react";
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView} from "react-native";
import {AppContext} from "../../context/AppContext";
import {DateTime} from "luxon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {produce} from "immer";
import {Dropdown} from 'react-native-element-dropdown';
import {Colors} from "../../constants/Colors";


export default function App() {
    const [surveyState, setSurveyState] = useState("Incomplete");
    const surveys = useContext(AppContext).surveys;
    const setSurveys = useContext(AppContext).setSurveys;
    const [todaysRating, setTodaysRating] = useState(-1);
    const [todaysMood, setTodaysMood] = useState("");
    const userName = useContext(AppContext).userInfo.name;

    const darkMode = useContext(AppContext).userInfo.darkMode;

    const styles = StyleSheet.create({
        viewMargins: {
            marginTop: 60,
            marginLeft: 30,
            marginRight: 30
        },
        headers: {
            fontSize: 40,
            fontWeight: "bold",
            color: darkMode ? Colors.dark.text : Colors.light.text
        },
        headersSecondary: {
            fontSize: 20,
            paddingBottom: 10,
            color: darkMode ? Colors.dark.text : Colors.light.text
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
            backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground,
            borderRadius: 10,
        },
        dropdownContainer: {
            alignSelf: "center",
            marginBottom: 10,
            width: Dimensions.get("window").width / 1.1,
            backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground,
            borderRadius: 10,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
        },
        row: {
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
        },
        submittedButton: {
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 24.5,
            paddingRight: 24.5,
            borderRadius: 70,
            backgroundColor: "#f13939",
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10,
        },
        submittedTenButton: {
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20.5,
            paddingRight: 20.5,
            borderRadius: 70,
            backgroundColor: "#f13939",
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10
        },
        dropdown: {
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,
            width: 300,
            marginLeft: 10,
            color: (darkMode)?Colors.dark.text:Colors.light.text,
            backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground,
        },
        widgetContainer: {
            marginBottom: 10,
            width: 150,
            height:200,
            backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground,
            borderRadius: 10,
        }
    })


    const moodList = [
        {label: 'Anxious', value: '1'},
        {label: 'Depressed', value: '2'},
        {label: 'Sad', value: '3'},
        {label: 'Stressed', value: '4'},
        {label: 'Grumpy', value: '5'},
        {label: 'Happy', value: '6'},
        {label: 'Excited', value: '6'},
        {label: 'Energetic', value: '6'},
        {label: 'Restless', value: '6'},
        {label: 'Tired', value: '6'},
        {label: 'Lethargic', value: '6'},
    ];

    useEffect(() => {
        if (isSurveyCompletedToday()) {
            setTodaysRating(surveys[surveys.length - 1].rating ?? -1);
            setTodaysMood(surveys[surveys.length - 1].mood ?? "")
        }
    }, [])


    function isSurveyCompletedToday() {
        if (!surveys || surveys.length === 0) return false;
        const now = DateTime.now().toLocal().startOf("day");
        const last_survey_completed = DateTime.fromISO(surveys[surveys.length - 1].createdAt).toLocal().startOf("day");
        const diff = now.diff(last_survey_completed, ["days", "hours"]).days;
        return diff < 1;
    }

    function submitRating(rating) {
        const luxonNowIsoString = DateTime.now().toLocal();
        let newDraft;
        if (!isSurveyCompletedToday()) {
            newDraft = produce(surveys, draft => {
                draft.push({
                    "createdAt": luxonNowIsoString.startOf("day").toISO(),
                    "ratingCreatedAt": luxonNowIsoString.toISO(),
                    "rating": rating
                })
            })
        } else {
            newDraft = produce(surveys, draft => {
                draft[draft.length - 1].rating = rating;
                draft[draft.length - 1].ratingCreatedAt = luxonNowIsoString.toISO();
            })
        }
        AsyncStorage.setItem('surveys', JSON.stringify(newDraft));
        setTodaysRating(rating);
        setSurveys(newDraft);
    }

    function submitMood(mood) {
        const luxonNowIsoString = DateTime.now().toLocal();
        mood = mood.label;
        let newDraft;
        if (!isSurveyCompletedToday()) {
            newDraft = produce(surveys, draft => {
                draft.push({
                    "createdAt": luxonNowIsoString.startOf("day").toISO(),
                    "moodCreatedAt": luxonNowIsoString.toISO(),
                    "mood": mood
                })
            })
        } else {
            newDraft = produce(surveys, draft => {
                draft[draft.length - 1].mood = mood
                draft[draft.length - 1].moodCreatedAt = luxonNowIsoString.toISO();
            })
        }
        AsyncStorage.setItem('surveys', JSON.stringify(newDraft));
        setSurveys(newDraft);
        setTodaysMood(mood)
    }

    return (
        <ScrollView style = {{backgroundColor: (darkMode)?Colors.dark.background:Colors.light.background}}>
            <SafeAreaView style={styles.viewMargins}>
                <Text style={styles.headers}>POSITIVELY</Text>
                <Text style={styles.headersSecondary}>Welcome Back, {userName}</Text>
                {surveyState === "Incomplete" &&
                    <View style={styles.container}>
                        <View style={{marginLeft: 10, marginRight: 10}}>
                            <Text style={{alignSelf: "center", marginBottom: 20, marginTop: 10, color: (darkMode)?Colors.dark.text:Colors.light.text}}>How are you feeling
                                today?</Text>
                            <View style={styles.row}>
                                {[...Array(5)].map((x, i) => (
                                    <TouchableOpacity key={i + 1}
                                                      style={(i + 1 === todaysRating) ? styles.submittedButton : styles.button}
                                                      onPress={() => {
                                                          submitRating(i + 1);
                                                      }}><Text style = {{color: "#fff"}}>{i + 1}</Text></TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.row}>
                                {[...Array(4)].map((x, i) => (
                                    <TouchableOpacity key={i + 6}
                                                      style={(i + 6 === todaysRating) ? styles.submittedButton : styles.button}
                                                      onPress={() => {
                                                          submitRating(i + 6);
                                                      }}><Text style = {{color: "#fff"}}>{i + 6}</Text></TouchableOpacity>
                                ))}
                                <TouchableOpacity key={10}
                                                  style={todaysRating === 10 ? styles.submittedTenButton : styles.tenButton}
                                                  onPress={() => submitRating(10)}><Text style = {{color: "#fff"}}>{10}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>}
                <View style={styles.dropdownContainer}>
                    <Text style={{fontSize: 14, padding: 10, paddingBottom: 18, paddingTop: 18, color: darkMode ? Colors.dark.text : Colors.light.text}}> How'd you describe how
                        you're feeling today? </Text>
                    <Dropdown
                        style={styles.dropdown}
                        itemTextStyle={{color: (darkMode)?Colors.dark.text:Colors.light.text}}
                        selectedTextStyle={{color: (darkMode)?Colors.dark.text:Colors.light.text}}
                        placeholderStyle={{color: (darkMode)?Colors.dark.text:Colors.light.text}}
                        containerStyle={{backgroundColor: (darkMode)?Colors.dark.widgetBackground:Colors.light.widgetBackground}}
                        data={moodList}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={`${todaysMood ?? "Select"}`}
                        onChange={(item) => submitMood(item)}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.widgetContainer}>
                        <Text style = {{color: darkMode ? Colors.dark.text : Colors.light.text, textAlign:"center", paddingTop:10, paddingBottom:10}}>Make a new log</Text>
                        <TouchableOpacity><Image
                            style={{width: 100, height: 100, alignSelf: "center", marginTop:20}}
                            tintColor={darkMode ? Colors.dark.text : Colors.light.text}
                            source={require('../../assets/images/book-outline.png')}/></TouchableOpacity>
                    </View>
                    <View style={{flexGrow: 1}}></View>
                    <View style={styles.widgetContainer}>
                        <Text style = {{color: darkMode ? Colors.dark.text : Colors.light.text, textAlign:"center", paddingTop:10, paddingBottom:10}}>Change the notification</Text>
                        <TouchableOpacity><Image style={{width: 100, height: 100, alignSelf: "center"}}
                                                 tintColor={darkMode ? Colors.dark.text : Colors.light.text}
                                                 source={require('../../assets/images/notifications-circle-outline.png')}/></TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}
