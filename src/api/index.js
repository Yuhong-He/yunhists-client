import axios from 'axios';
import {getCookie} from "@/utils/cookie";

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
                "token": getCookie("token")
            },
            url: BASE_URL + "/user/updateLang",
            method: "post",
            params: data
        })
    },
    sendVerificationEmail(data) {
        return axios({
            url: BASE_URL + "/user/sendVerificationEmail",
            method: "post",
            params: data
        })
    }
}

export default api;