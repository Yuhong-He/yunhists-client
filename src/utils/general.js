import i18n from "@/lang";
import {Message} from "element-ui";
import router from "@/router";

export function getTitle(page) {
    return i18n.tc("title." + page) + i18n.tc("title.siteName");
}

export function generalError(data) { // error with request.js Promise.resolve

    const authenticationError = [
        203, 205, 223, 224, 225
    ]
    if (authenticationError.includes(data.code)) {
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