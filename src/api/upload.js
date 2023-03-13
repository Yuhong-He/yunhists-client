import axios from "axios";
import {getToken} from "@/utils/token";
import {BASE_URL} from "@/api/index";

const path = "/share";

export default {
    shareThesis(share) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/add",
            method: "post",
            data: share
        })
    },
    listMySharing(page, title) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/myList/" + page,
            method: "get",
            params: {
                title: title
            }
        })
    },
    deleteMySharing(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/delete/" + id,
            method: "delete"
        })
    },
    getMyShareById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/myShare/" + id,
            method: "get"
        })
    },
    deleteShareFile(file) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/deleteFile",
            method: "delete",
            params: {
                file: file
            }
        })
    },
    updateThesisSharing(id, share) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/update/" + id,
            method: "put",
            data: share
        })
    },
    listAllSharing(page, title, unapproved) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/listAll/" + page,
            method: "get",
            params: {
                title: title,
                unapproved: unapproved
            }
        })
    },
    getShareById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/id/" + id,
            method: "get"
        })
    },
    approveShare(id, share, categories) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/approve/" + id,
            method: "put",
            data: share,
            params: {
                category: categories
            }
        })
    },
    rejectShare(id, reason) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/reject/" + id,
            method: "put",
            params: {
                reason: reason
            }
        })
    }
}