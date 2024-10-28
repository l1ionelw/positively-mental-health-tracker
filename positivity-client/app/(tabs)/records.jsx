import {Dimensions, SafeAreaView, Text, View, StyleSheet, ScrollView} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../context/AppContext";
import {DateTime} from "luxon";
import {Colors} from "../../constants/Colors";

export default function Records() {
    const logs = useContext(AppContext).logs;
    const surveyData = useContext(AppContext).surveys;
    const [allData, setAllData] = useState([]);
    const darkMode = useContext(AppContext).userInfo.darkMode;

    const screenWidth = Dimensions.get("window").width;
    let surveyRatings = [];
    const [surveyGraphData, setSurveyGraphData] = useState([]);

    for (let survey of surveyData) {
        if (survey == null || survey['rating'] === undefined) {
            continue;
        }
        surveyRatings.push(survey['rating']);
    }

    const minValue = Math.min(...surveyRatings);
    const maxValue = Math.max(...surveyRatings);

    const LineGraph = () => {
        return (
            <View>
                <LineChart
                    data={{
                        labels: [],
                        datasets: [
                            {
                                data: surveyRatings,
                            },
                        ],
                    }}
                    width={screenWidth / 1.1}
                    height={220}
                    yAxisInterval={0.1}
                    yMin={(surveyRatings.length > 0) ? minValue : (0)}
                    yMax={(surveyRatings.length > 0) ? maxValue : (10)}
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        alignSelf: "center"
                    }}
                />
            </View>
        );
    };

    useEffect(() => {
        let tempData = new Map();
        // Process logs
        for (let log of logs) {
            const day = DateTime.fromISO(log.createdAt).startOf("day").toISO();
            tempData.set(day, {
                logCreatedAt: log.createdAt,
                logTitle: log.title,
                logContent: log.content
            })
        }

        for (let survey of surveyData) {
            const day = DateTime.fromISO(survey.createdAt).startOf("day").toISO();
            if (tempData.has(day)) {
                let existing = tempData.get(day);
                tempData.set(day, {...existing, ...survey});
            } else {
                tempData.set(day, survey);
            }
        }

        setAllData(Array.from(tempData.entries()));
    }, [logs, surveyData]);

    if (logs.length === 0 && surveyData.length === 0) {
        return <SafeAreaView style={styles.viewMargins}><Text style={[styles.header, {color: (darkMode) ? Colors.dark.text : Colors.light.text}]}>Records</Text><Text
            style={{fontSize: 25}}>You haven't done anything
            yet!</Text></SafeAreaView>;
    }

    return (
        <ScrollView style = {{backgroundColor: (darkMode) ? Colors.dark.background : Colors.light.background}}>
            <SafeAreaView style={styles.viewMargins}>
                <Text style={[styles.header, {color: (darkMode) ? Colors.dark.text : Colors.light.text}]}>Records</Text>
                {
                    allData.map(([dateKey, data], index) => {
                            const surveyString = `${data.mood ? `${data.mood} - ` : ""} ${data.rating ? `${data.rating}/10` : ""}`
                            return (
                                <View style={[styles.container, {backgroundColor: (darkMode)?Colors.dark.widgetBackground : Colors.light.widgetBackground,}]} key={dateKey}>
                                    <View style={styles.logContainer}>
                                        <Text style = {{color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{DateTime.fromISO(dateKey).toLocaleString({
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}</Text>
                                        {<Text style={{fontWeight: "bold", color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{data.logTitle}</Text>}
                                        <Text style = {{color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{surveyString}</Text>
                                        {data.logCreatedAt && <>
                                            <Text style = {{color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{DateTime.fromISO(data.logCreatedAt).toFormat('hh:mm a')}</Text>
                                            <Text style = {{color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{data.logTitle}</Text>
                                            <Text style = {{color: (darkMode) ? Colors.dark.text : Colors.light.text}}>{data.logContent}</Text>
                                        </>}
                                    </View>
                                </View>
                            )
                        }
                    )
                }
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        borderRadius: 10,
    },
    logContainer: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15
    },
    header: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 20
    },
    logHeader: {
        fontSize: 18,
        fontWeight: "bold",
    },
    viewMargins: {
        marginTop: 60,
        marginLeft: 30,
        marginRight: 30
    },
});
