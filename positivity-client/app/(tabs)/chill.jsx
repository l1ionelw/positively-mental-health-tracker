import {SafeAreaView, Text} from "react-native";
import React from "react";

// Replace with the actual API endpoint and key
const API_ENDPOINT = 'https://gemini-api.google.com/v1/models';
const API_KEY = 'AIzaSyB4g7fGgC-rbegkgFvUBWhc_gDCtHiFOys';

export default function Chill() {

    const callGeminiAPI = async (prompt) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt, // The data you want to send to the API
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json().then(()=>{
                
            });
            console.log(data);
            return data; // Return the API response
        } catch (error) {
            console.error('Error fetching data from API:', error);
            throw error;
        }
        return "Gemini failed";
    };
        return (
            <SafeAreaView>
                <Text>Chill</Text>
                <Text>{callGeminiAPI('Give me some calming activities to do.')}</Text>
            </SafeAreaView>
        )
}