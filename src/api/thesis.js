import axios from "axios";
import {getToken} from "@/utils/token";
import {BASE_URL} from "@/api/index";

const path = "/thesis";

export default {
    addThesis(thesis, parentCat) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/add",
            method: "post",
            data: thesis,
            params: {
                category: parentCat
            }
        })
    },
    getThesisList(page, pageSize, query, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + path + "/list/" + page + "/" + pageSize,
            method: "get",
            params: {
                author: query.author,
                title: query.title,
                publication: query.publication,
                year: query.year,
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    getReference(id) {
        return axios({
            url: BASE_URL + path + "/cite/" + id,
            method: "get"
        })
    },
    getOnlinePublishInfo(id) {
        return axios({
            url: BASE_URL + path + "/onlinePublishInfo/" + id,
            method: "get"
        })
    },
    getDownloadNum() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/getDownloadNum",
            method: "get"
        })
    },
    getFileName(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/file/" + id,
            method: "get"
        })
    },
    getThesisById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/id/" + id,
            method: "get"
        })
    },
    deleteThesisFile(file) {
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
    updateThesis(thesis, parentCat, id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/update",
            method: "put",
            data: thesis,
            params: {
                id: id,
                category: parentCat
            }
        })
    },
    deleteThesis(id, reason) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/delete/" + id,
            method: "delete",
            data: reason
        })
    },
    getCategoryTheses(id, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + path + "/categoryTheses/" + id,
            method: "get",
            params: {
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    getMissingFileTheses() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/missingFile",
            method: "get"
        })
    },
    getThesisWithoutCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/thesisWithoutCat",
            method: "get"
        })
    },
}