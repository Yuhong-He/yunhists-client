import axios from 'axios';
import {getToken} from "@/utils/token";

const BASE_URL = "http://localhost:9999/api";

const api = {
    login(data) {
        return axios({
            url: BASE_URL + "/user/login",
            method: "post",
            params: data
        })
    },
    register(data) {
        return axios({
            url: BASE_URL + "/user/register",
            method: "post",
            params: data
        })
    },
    updateLang(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateLang",
            method: "post",
            params: data
        })
    },
    sendVerificationEmail(data) {
        return axios({
            url: BASE_URL + "/user/sendRegisterEmail",
            method: "post",
            params: data
        })
    },
    resetPassword(data) {
        return axios({
            url: BASE_URL + "/user/resetPassword",
            method: "post",
            params: data
        })
    },
    deleteAccount() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/delete",
            method: "post"
        })
    },
    updateUsername(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateUsername",
            method: "post",
            params: data
        })
    },
    sendChangeEmailEmail(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/sendChangeEmailEmail",
            method: "post",
            params: data
        })
    },
    updateEmail(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateEmail",
            method: "post",
            params: data
        })
    },
    updatePassword(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updatePassword",
            method: "post",
            params: data
        })
    }
}

export default api;