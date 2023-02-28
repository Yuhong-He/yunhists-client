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
    },
    getCategoryOption(catName, lang) {
        return axios({
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post",
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
            method: "post"
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
            url: BASE_URL + "/share/list/" + page,
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
            method: "post"
        })
    },
    getMyShareById(id) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/id/" + id,
            method: "get"
        })
    },
    deleteShareFile(file) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + "/share/deleteFile",
            method: "post",
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
            method: "post",
            data: share
        })
    },
}

export default api;