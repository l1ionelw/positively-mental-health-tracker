import {Dimensions, SafeAreaView, Text, View, StyleSheet} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../context/AppContext";
import {DateTime} from "luxon";
import {LineChart} from "react-native-chart-kit";

export default function Records() {
    const logs = useContext(AppContext).logs;
    const surveyData = useContext(AppContext).surveys;
    const [allData, setAllData] = useState([]);

    const screenWidth = Dimensions.get("window").width;
    let surveyRatings = [];

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
                    width={screenWidth/1.1}
                    height={220}
                    yAxisInterval={0.1}
                    yMin={(surveyRatings.length > 0) ? minValue: (0)}
                    yMax={(surveyRatings.length > 0) ? maxValue: (10)}
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
                        alignSelf:"center"
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
        return <SafeAreaView style={styles.viewMargins}><Text style={{fontSize: 25}}>You haven't done anything
            yet!</Text></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.viewMargins}>
            <Text style={styles.header}>Records</Text>
            <LineGraph/>
            {allData.length > 0 ? (
                allData.map(([dateKey, data], index) => {
                    const surveyString = `${data.mood ? `You felt ${data.surveyData}` : ""}`;
                    console.log(surveyString);
                    console.log(data)
                    return (
                        <View style={styles.container}>
                            <View style={styles.logContainer}>
                                <Text style={{fontWeight: "bold"}}>{data.logTitle}</Text>
                                <Text>{DateTime.fromISO(dateKey).toLocaleString({
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                })}</Text>
                                <Text>{surveyString}</Text>
                                <Text>{JSON.stringify(data)}</Text>
                            </View>
                        </View>
                    )
                    const dateCreated = data.surveyData?.createdAt || data.logCreatedAt;
                    const formattedDate = DateTime.fromISO(dateCreated).toLocaleString({
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });

                    if (!data.logTitle && !data.logContent && !data.surveyData) {
                        return null;
                    }

                    // Directly use surveyData from the 'data' variable
                    const currentSurveyValue = data.surveyData?.rating || '-';
                    const currentSurveyMood = data.surveyData?.mood || 'Unknown Mood';

                    return (
                        <View key={index} style={styles.container}>
                            <Text style={styles.logHeader}>
                                {formattedDate} - {data.logTitle}
                            </Text>
                            {data.logTitle ? (
                                <>
                                    <Text>I felt {currentSurveyMood} and rated my day {currentSurveyValue}/10</Text>
                                    <Text style={{fontSize: 16, marginTop: 15}}>{data.logContent}</Text>
                                </>
                            ) : (
                                <Text></Text>
                            )}
                        </View>
                    );
                })
            ) : (
                <Text>No Records Found</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        marginBottom: 10,
        width: Dimensions.get("window").width / 1.1,
        backgroundColor: "#e6e6e6",
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
