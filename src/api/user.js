import request from "@/utils/request";
import store from "@/store";

const path = "/user";

export default {
    login(data) {
        return request({
            url: path + "/login",
            method: "post",
            data: data
        })
    },
    google(email, username, lang) {
        return request({
            url: path + "/google",
            method: "post",
            data: {
                email: email,
                username: username,
                lang: lang
            }
        })
    },
    register(data) {
        return request({
            url: path + "/register",
            method: "post",
            data: data
        })
    },
    refreshSTS() {
        return request({
            url: path + "/refreshSTS",
            method: "post",
            data: store.state.User.refreshToken
        })
    },
    updateLang(data) {
        return request({
            url: path + "/updateLang",
            method: "put",
            params: data
        })
    },
    sendVerificationEmail(data) {
        return request({
            url: path + "/sendRegisterEmail",
            method: "post",
            params: data
        })
    },
    resetPassword(data) {
        return request({
            url: path + "/resetPassword",
            method: "post",
            params: data
        })
    },
    getUserInfo() {
        return request({
            url: path + "/getUserInfo",
            method: "get"
        })
    },
    deleteAccount() {
        return request({
            url: path + "/delete",
            method: "delete"
        })
    },
    updateUsername(data) {
        return request({
            url: path + "/updateUsername",
            method: "put",
            params: data
        })
    },
    sendChangeEmailEmail(data) {
        return request({
            url: path + "/sendChangeEmailEmail",
            method: "post",
            params: data
        })
    },
    updateEmail(data) {
        return request({
            url: path + "/updateEmail",
            method: "put",
            params: data
        })
    },
    updatePassword(data) {
        return request({
            url: path + "/updatePassword",
            method: "put",
            params: data
        })
    },
    updateEmailNotification(status) {
        return request({
            url: path + "/updateEmailNotification",
            method: "put",
            params: {
                status: status
            }
        })
    }
}