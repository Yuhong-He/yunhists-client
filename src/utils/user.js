import store from "@/store";
import i18n from "@/lang";

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

export function setUserInfo(data) {
    store.commit('UserInfo/setAccessToken', data.access_token);
    store.commit('UserInfo/setRefreshToken', data.refresh_token);
    store.commit('UserInfo/setExpiredTime', data.expired_time);
    store.commit('UserInfo/setUsername', data.username);
    store.commit('UserInfo/setUserRights', data.userRights);
    store.commit('Aliyun/setAccessKeyId', data.sts.accessKeyId);
    store.commit('Aliyun/setAccessKeySecret', data.sts.accessKeySecret);
    store.commit('Aliyun/setStsToken', data.sts.stsToken);
}

export function refreshUserToken(data) {
    store.commit('UserInfo/setAccessToken', data.access_token);
    store.commit('UserInfo/setExpiredTime', data.expired_time);
    store.commit('Aliyun/setAccessKeyId', data.sts.accessKeyId);
    store.commit('Aliyun/setAccessKeySecret', data.sts.accessKeySecret);
    store.commit('Aliyun/setStsToken', data.sts.stsToken);
}

export function cleanUserInfo() {
    store.commit('UserInfo/setAccessToken', "");
    store.commit('UserInfo/setRefreshToken', "");
    store.commit('UserInfo/setExpiredTime', "");
    store.commit('UserInfo/setUsername', "");
    store.commit('UserInfo/setUserRights', "");
    store.commit('Aliyun/setAccessKeyId', "");
    store.commit('Aliyun/setAccessKeySecret', "");
    store.commit('Aliyun/setStsToken', "");
}