import {SafeAreaView, Text, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../context/AppContext";
import {DateTime} from "luxon";

export default function Records() {
    const [loading, setLoading] = useState(false);
    const logs = useContext(AppContext).logs;
    const surveyData = useContext(AppContext).surveys;
    let allData = new Map();
    useEffect(() => {
        for (let x of logs) {
            const day = DateTime.fromISO(x.createdAt).startOf("day").toISO();
            allData.set(day, {"logCreatedAt": x.createdAt, "logTitle": x.title, "logContent": x.content})
        }
        for (let x of surveyData) {
            const day = x.createdAt;
            if (allData.has(day)) {
                let thisArray = allData.get(day);
                thisArray = {...thisArray, ...x}
                allData.set(day, thisArray);
            } else {
                allData.set(day, x);
            }
        }
        console.log(allData);
    }, [])
    if (logs.length === 0) {
        return (<Text style={{fontSize: 40}}>No logs</Text>)
    }

    allData.forEach((x, y)=>{
        console.log("sdfk");
        console.log(x);
        console.log(y);
    })


    return (
        <SafeAreaView>
            <Text>Records</Text>
            <View>
            </View>
        </SafeAreaView>
    )
}