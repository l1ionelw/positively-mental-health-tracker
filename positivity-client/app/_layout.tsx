import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "@/app/(tabs)/onboarding";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [firstAppLaunch, setFirstAppLaunch] = useState(true);


    useEffect(() => {
        AsyncStorage.getItem("userInfo").then((result) => {
            setFirstAppLaunch(result === null); // if no result, first app loaded is true, otherwise its false
            setInfoLoaded(true); // all done loading
        })
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded && !infoLoaded) {
        return null;
    }

    if (firstAppLaunch) {
        console.log("launching first app launch experience");
        return <Onboarding/>
    } else {
        return (
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
            </ThemeProvider>
        );
    }
}
