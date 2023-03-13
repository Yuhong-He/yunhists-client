import store from "@/store";
import router from "@/router";
import Vue from "vue";
import i18n from "@/lang";
import {setToken} from "@/utils/token";

function generalError(data) {
    if(data.code === 201) {
        Vue.prototype.$alert("Unexpected Error", {
            confirmButtonText: i18n.tc('header.confirm'),
            callback: () => {}
         }).then(() => {});
    } else {
        setToken("");
        store.state.UserInfo.username = "";
        store.state.UserInfo.userRights = "";
        store.state.Aliyun.accessKeyId = "";
        store.state.Aliyun.accessKeySecret = "";
        store.state.Aliyun.stsToken = "";
        if(router.currentRoute.path !== '/login') {
            printErrorMsg(data.code)
            router.push('/login');
        }
    }
}

function printErrorMsg(errorCode) {
    if(errorCode === 205) {
        Vue.prototype.$message.error(i18n.tc('util.user.noUser'));
    } else if (errorCode === 203) {
        Vue.prototype.$message.error(i18n.tc('util.user.noPermission'));
    } else if (errorCode === 223) {
        Vue.prototype.$message.error(i18n.tc('util.user.tokenExpired'));
    } else if (errorCode === 224) {
        Vue.prototype.$message.error(i18n.tc('util.user.tokenError'));
    } else if (errorCode === 225) {
        Vue.prototype.$message.error(i18n.tc('util.user.missingToken'));
    } else {
        Vue.prototype.$message.error(i18n.tc('util.user.unknownError'));
    }
}

function initLang() {
    if(store.state.Settings.lang && store.state.Settings.lang.length > 0) {
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

export {generalError, initLang};