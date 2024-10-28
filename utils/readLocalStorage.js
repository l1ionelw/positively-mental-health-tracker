import AsyncStorage from "@react-native-async-storage/async-storage";

const readLocalStorage = (key) => {
    try {
        const jsonValue = AsyncStorage.getItem(key).then((result)=>{
            return jsonValue != null ? JSON.parse(result) : null;
        });
    } catch (e) {
        return e;
    }
}
module.exports = {readLocalStorage};