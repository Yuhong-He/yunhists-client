import request from "@/utils/request";

const path = "/upload";

export default {
    uploadThesis(upload) {
        return request({
            url: path + "/add",
            method: "post",
            data: upload
        })
    },
    listMyUpload(page, title) {
        return request({
            url: path + "/myList/" + page,
            method: "get",
            params: {
                title: title
            }
        })
    },
    deleteMyUpload(id) {
        return request({
            url: path + "/delete/" + id,
            method: "delete"
        })
    },
    getMyUploadById(id) {
        return request({
            url: path + "/myUpload/" + id,
            method: "get"
        })
    },
    deleteUploadFile(file) {
        return request({
            url: path + "/deleteFile",
            method: "delete",
            params: {
                file: file
            }
        })
    },
    updateThesisUpload(id, upload) {
        return request({
            url: path + "/update/" + id,
            method: "put",
            data: upload
        })
    },
    listAllUpload(page, title, unapproved) {
        return request({
            url: path + "/listAll/" + page,
            method: "get",
            params: {
                title: title,
                unapproved: unapproved
            }
        })
    },
    getUploadById(id) {
        return request({
            url: path + "/id/" + id,
            method: "get"
        })
    },
    approveUpload(id, upload, categories) {
        return request({
            url: path + "/approve/" + id,
            method: "put",
            data: upload,
            params: {
                category: categories
            }
        })
    },
    rejectUpload(id, reason) {
        return request({
            url: path + "/reject/" + id,
            method: "put",
            params: {
                reason: reason
            }
        })
    }
}