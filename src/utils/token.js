import store from "@/store";
import {getCookie} from "@/utils/cookie";

function setAccessToken(token) {
    document.cookie = "access_token=" + token;
    store.commit('UserInfo/setAccessToken', token);
}

function setRefreshToken(token) {
    document.cookie = "refresh_token=" + token;
    store.commit('UserInfo/setRefreshToken', token);
}

function setExpiredTime(time) {
    store.commit('UserInfo/setExpiredTime', time);
}

function getAccessToken() {
    return getCookie("access_token");
}

function getRefreshToken() {
    return getCookie("refresh_token");
}
export {setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, setExpiredTime};