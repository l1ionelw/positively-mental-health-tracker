import {createContext} from "react";

export const AppContext = createContext({
    logs:[],
    surveys:[],
    userInfo:{
        'darkMode': false,
        'name':''
    }
});