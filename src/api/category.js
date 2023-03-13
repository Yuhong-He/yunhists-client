import axios from "axios";
import {getToken} from "@/utils/token";
import {BASE_URL} from "@/api/index";

const path = "/category";

export default {
    getCategoryOption(catName, lang) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/option/" + catName + "/" + lang,
            method: "get"
        })
    },
    addCategory(data) {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/add",
            method: "post",
            data: data
        })
    },
    getCategoryList(lang, page, pageSize, query, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + path + "/list/" + lang +"/" + page + "/" + pageSize,
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
            url: BASE_URL + path + "/addCatALot",
            method: "put",
            data: data
        })
    },
    getCategoryByIds(ids) {
        return axios({
            url: BASE_URL + path + "/ids",
            method: "get",
            params: {
                ids: ids
            }
        })
    },
    getCategoryInfo(id) {
        return axios({
            url: BASE_URL + path + "/id/" + id,
            method: "get"
        })
    },
    getCategoryParentCats(id) {
        return axios({
            url: BASE_URL + path + "/parentCats/" + id,
            method: "get"
        })
    },
    getCategoryChildCats(id, sortCol, sortOrder) {
        return axios({
            url: BASE_URL + path + "/childCat/" + id,
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
            url: BASE_URL + path + "/updateCatName/" + id,
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
            url: BASE_URL + path + "/updateCatParentCat/" + id,
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
            url: BASE_URL + path + "/removeFromCat/" + id,
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
            url: BASE_URL + path + "/moveTo",
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
            url: BASE_URL + path + "/delete/" + catId,
            method: "delete"
        })
    },
    getCatWithoutCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/catWithoutCat",
            method: "get"
        })
    },
    getEmptyCat() {
        return axios({
            headers: {
                "token": getToken()
            },
            url: BASE_URL + path + "/emptyCat",
            method: "get"
        })
    }
}