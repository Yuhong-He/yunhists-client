import axios from "axios";
import {getToken} from "@/utils/token";
import {BASE_URL} from "@/api/index";

const path = "/user";

export default {
    login(data) {
        return axios({
            url: BASE_URL + path + "/login",
            method: "get",
            params: data
        })
    },
    google(email, username, lang) {
        return axios({
            url: BASE_URL + path + "/google",
            method: "get",
            params: {
                email: email,
                username: username,
                lang: lang
            }
        })
    },
    register(data) {
        return axios({
            url: BASE_URL + path + "/register",
            method: "post",
            params: data
        })
    },
    validateToken() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/validateToken",
            method: "get"
        })
    },
    refreshSTS() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/refreshSTS",
            method: "get"
        })
    },
    updateLang(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/updateLang",
            method: "put",
            params: data
        })
    },
    sendVerificationEmail(data) {
        return axios({
            url: BASE_URL + path + "/sendRegisterEmail",
            method: "post",
            params: data
        })
    },
    resetPassword(data) {
        return axios({
            url: BASE_URL + path + "/resetPassword",
            method: "post",
            params: data
        })
    },
    getUserInfo() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/getUserInfo",
            method: "get"
        })
    },
    deleteAccount() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/delete",
            method: "delete"
        })
    },
    updateUsername(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/updateUsername",
            method: "put",
            params: data
        })
    },
    sendChangeEmailEmail(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/sendChangeEmailEmail",
            method: "post",
            params: data
        })
    },
    updateEmail(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/updateEmail",
            method: "put",
            params: data
        })
    },
    updatePassword(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/updatePassword",
            method: "put",
            params: data
        })
    },
    updateEmailNotification(status) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/updateEmailNotification",
            method: "put",
            params: {
                status: status
            }
        })
    }
}