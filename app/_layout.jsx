import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./onboarding";
import {AppContext} from "../context/AppContext";
import * as Notifications from 'expo-notifications';
import {registerPushNotificationsAsync} from "./(tabs)/registerPushNotificationsAsync";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [infoLoaded, setInfoLoaded] = useState(null);
    const [firstAppLaunchStatus, setFirstAppLaunchStatus] = useState("Loading");
    const [logs, setLogs] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [notificationPermission, setNotificationPermission] = useState(null);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    useEffect(() => {
        const userInfoPromise = AsyncStorage.getItem("userInfo").then((result) => {
            setFirstAppLaunchStatus(result === null ? "Onboarding" : "Home"); // if no result, first app loaded is true, otherwise its false
            if (result !== null) {
                setUserInfo(JSON.parse(result))
            }
        })
        const logsPromise = AsyncStorage.getItem("logs").then((result) => {
            if (result !== null) {
                setLogs(JSON.parse(result));
            }
        })
        const surveysPromise = AsyncStorage.getItem("surveys").then((result) => {
            if (result !== null) {
                setSurveys(JSON.parse(result))
            }
        })
        Promise.all([logsPromise, surveysPromise, userInfoPromise]).then(() => {
            setInfoLoaded(true); // all done loading
        })
        registerPushNotificationsAsync();
    }, [firstAppLaunchStatus]);

    if (!loaded || !infoLoaded || firstAppLaunchStatus === "Loading") {
        return null;
    }

    if (firstAppLaunchStatus === "Onboarding") {
        console.log("launching first app launch experience");
        return <Onboarding setFirstAppLaunch={setFirstAppLaunchStatus}/>
    } else {
        return (
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AppContext.Provider
                    value={{
                        "logs": logs,
                        "setLogs": setLogs,
                        "surveys": surveys,
                        "setSurveys": setSurveys,
                        "userInfo": userInfo,
                        "setUserInfo": setUserInfo,
                        "notificationPermission": notificationPermission,
                    }}>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </AppContext.Provider>
            </ThemeProvider>
        );
    }
}
