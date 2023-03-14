import request from "@/utils/request";

const path = "/thesis";

export default {
    addThesis(thesis, parentCat) {
        return request({
            url: path + "/add",
            method: "post",
            data: thesis,
            params: {
                category: parentCat
            }
        })
    },
    getThesisList(page, pageSize, query, sortCol, sortOrder) {
        return request({
            url: path + "/list/" + page + "/" + pageSize,
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
        return request({
            url: path + "/cite/" + id,
            method: "get"
        })
    },
    getOnlinePublishInfo(id) {
        return request({
            url: path + "/onlinePublishInfo/" + id,
            method: "get"
        })
    },
    getDownloadNum() {
        return request({
            url: path + "/getDownloadNum",
            method: "get"
        })
    },
    getFileName(id) {
        return request({
            url: path + "/file/" + id,
            method: "get"
        })
    },
    getThesisById(id) {
        return request({
            url: path + "/id/" + id,
            method: "get"
        })
    },
    deleteThesisFile(file) {
        return request({
            url: path + "/deleteFile",
            method: "delete",
            params: {
                file: file
            }
        })
    },
    updateThesis(thesis, parentCat, id) {
        return request({
            url: path + "/update",
            method: "put",
            data: thesis,
            params: {
                id: id,
                category: parentCat
            }
        })
    },
    deleteThesis(id, reason) {
        return request({
            url: path + "/delete/" + id,
            method: "delete",
            data: reason
        })
    },
    getCategoryTheses(id, sortCol, sortOrder) {
        return request({
            url: path + "/categoryTheses/" + id,
            method: "get",
            params: {
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    getMissingFileTheses() {
        return request({
            url: path + "/missingFile",
            method: "get"
        })
    },
    getThesisWithoutCat() {
        return request({
            url: path + "/thesisWithoutCat",
            method: "get"
        })
    },
}