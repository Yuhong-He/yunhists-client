import store from "@/store";
import i18n from "@/lang";
import {Message} from "element-ui";
import router from "@/router";

export function generalError(data) { // error with request.js Promise.resolve

    const authenticationError = [
        203, 205, 223, 224, 225
    ]
    if(authenticationError.includes(data.code)) {
        console.log("Authentication Error");
    } else {
        Message.error(i18n.tc('util.request.unexpectedError'));
        console.log(data.data);
    }
}

export function unexpectedError(res) { // error with request.js Promise.reject
    router.push("/");
    console.log(res);
}

export function initLang() {
    if (store.state.Settings.lang && store.state.Settings.lang.length > 0) {
        i18n.locale = store.state.Settings.lang;
    } else {
        switch (navigator.language.toLowerCase()) {
            case "zh-hans":
                i18n.locale = "zh";
                break;
            case "zh-cn":
                i18n.locale = "zh";
                break;
            case "zh":
                i18n.locale = "zh";
                break;
            case "zh-hant":
                i18n.locale = "zh";
                break;
            case "zh-hk":
                i18n.locale = "zh";
                break;
            case "zh-tw":
                i18n.locale = "zh";
                break;
            default:
                i18n.locale = "en";
                break;
        }
    }
}
