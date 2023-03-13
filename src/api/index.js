import axios from 'axios';
import {getToken} from "@/utils/token";

const BASE_URL = "http://localhost:9999/api";

const api = {
    login(data) {
        return axios({
            url: BASE_URL + "/user/login",
            method: "get",
            params: data
        })
    },
    google(email, username, lang) {
        return axios({
            url: BASE_URL + "/user/google",
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
            url: BASE_URL + "/user/register",
            method: "post",
            params: data
        })
    },
    validateToken() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/validateToken",
            method: "get"
        })
    },
    refreshSTS() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/refreshSTS",
            method: "get"
        })
    },
    updateLang(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateLang",
            method: "put",
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
    getUserInfo() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/getUserInfo",
            method: "get"
        })
    },
    deleteAccount() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/delete",
            method: "delete"
        })
    },
    updateUsername(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateUsername",
            method: "put",
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
            method: "put",
            params: data
        })
    },
    updatePassword(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updatePassword",
            method: "put",
            params: data
        })
    },
    updateEmailNotification(status) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/user/updateEmailNotification",
            method: "put",
            params: {
                status: status
            }
        })
    },
    getCategoryOption(catName, lang) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/option/" + catName + "/" + lang,
            method: "get"
        })
    },
    addCategory(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/add",
            method: "post",
            data: data
        })
    },
    getCategoryList(lang, page, pageSize, query, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + "/category/list/" + lang +"/" + page + "/" + pageSize,
            method: "get",
            params: {
                name: query,
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    addCatALot(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/addCatALot",
            method: "put",
            data: data
        })
    },
    getCategoryByIds(ids) {
        return axios({
            url: BASE_URL + "/category/ids",
            method: "get",
            params: {
                ids: ids
            }
        })
    },
    addThesis(thesis, parentCat) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/add",
            method: "post",
            data: thesis,
            params: {
                category: parentCat
            }
        })
    },
    getThesisList(page, pageSize, query, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + "/thesis/list/" + page + "/" + pageSize,
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
            url: BASE_URL + "/thesis/cite/" + id,
            method: "get"
        })
    },
    getOnlinePublishInfo(id) {
        return axios({
            url: BASE_URL + "/thesis/onlinePublishInfo/" + id,
            method: "get"
        })
    },
    getDownloadNum() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/getDownloadNum",
            method: "get"
        })
    },
    getFileName(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/file/" + id,
            method: "get"
        })
    },
    getThesisById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/id/" + id,
            method: "get"
        })
    },
    deleteThesisFile(file) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/deleteFile",
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
            url: BASE_URL + "/thesis/update",
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
            url: BASE_URL + "/thesis/delete/" + id,
            method: "delete",
            data: reason
        })
    },
    getCategoryInfo(id) {
        return axios({
            url: BASE_URL + "/category/id/" + id,
            method: "get"
        })
    },
    getCategoryParentCats(id) {
        return axios({
            url: BASE_URL + "/category/parentCats/" + id,
            method: "get"
        })
    },
    getCategoryChildCats(id, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + "/category/childCat/" + id,
            method: "get",
            params: {
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    getCategoryTheses(id, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + "/thesis/categoryTheses/" + id,
            method: "get",
            params: {
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    updateCategoryName(id, zhName, enName) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/updateCatName/" + id,
            method: "put",
            params: {
                zhName: zhName,
                enName: enName
            }
        })
    },
    updateCatParentCat(id, lang, categories) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/updateCatParentCat/" + id,
            method: "put",
            params: {
                lang: lang,
                categories: categories
            }
        })
    },
    removeFromCat(id, subCats, subTheses) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/removeFromCat/" + id,
            method: "delete",
            params: {
                subCats: subCats,
                subTheses: subTheses
            }
        })
    },
    moveTo(originId, destId, subCats, subTheses) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/moveTo",
            method: "put",
            params: {
                originId: originId,
                destId: destId,
                subCats: subCats,
                subTheses: subTheses
            }
        })
    },
    deleteCat(catId) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/delete/" + catId,
            method: "delete"
        })
    },
    shareThesis(share) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/add",
            method: "post",
            data: share
        })
    },
    listMySharing(page, title) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/myList/" + page,
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
            url: BASE_URL + "/share/delete/" + id,
            method: "delete"
        })
    },
    getMyShareById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/myShare/" + id,
            method: "get"
        })
    },
    deleteShareFile(file) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/deleteFile",
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
            url: BASE_URL + "/share/update/" + id,
            method: "put",
            data: share
        })
    },
    listAllSharing(page, title, unapproved) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/listAll/" + page,
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
            url: BASE_URL + "/share/id/" + id,
            method: "get"
        })
    },
    approveShare(id, share, categories) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/approve/" + id,
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
            url: BASE_URL + "/share/reject/" + id,
            method: "put",
            params: {
                reason: reason
            }
        })
    },
    getMissingFileTheses() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/missingFile",
            method: "get"
        })
    },
    getThesisWithoutCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/thesis/thesisWithoutCat",
            method: "get"
        })
    },
    getCatWithoutCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/catWithoutCat",
            method: "get"
        })
    },
    getEmptyCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/category/emptyCat",
            method: "get"
        })
    },
    getStatisticsData() {
        return axios({
            url: BASE_URL + "/statistics",
            method: "get"
        })
    }
}

export default api;