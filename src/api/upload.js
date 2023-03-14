import request from "@/utils/request";

const path = "/share";

export default {
    shareThesis(share) {
        return request({
            url: path + "/add",
            method: "post",
            data: share
        })
    },
    listMySharing(page, title) {
        return request({
            url: path + "/myList/" + page,
            method: "get",
            params: {
                title: title
            }
        })
    },
    deleteMySharing(id) {
        return request({
            url: path + "/delete/" + id,
            method: "delete"
        })
    },
    getMyShareById(id) {
        return request({
            url: path + "/myShare/" + id,
            method: "get"
        })
    },
    deleteShareFile(file) {
        return request({
            url: path + "/deleteFile",
            method: "delete",
            params: {
                file: file
            }
        })
    },
    updateThesisSharing(id, share) {
        return request({
            url: path + "/update/" + id,
            method: "put",
            data: share
        })
    },
    listAllSharing(page, title, unapproved) {
        return request({
            url: path + "/listAll/" + page,
            method: "get",
            params: {
                title: title,
                unapproved: unapproved
            }
        })
    },
    getShareById(id) {
        return request({
            url: path + "/id/" + id,
            method: "get"
        })
    },
    approveShare(id, share, categories) {
        return request({
            url: path + "/approve/" + id,
            method: "put",
            data: share,
            params: {
                category: categories
            }
        })
    },
    rejectShare(id, reason) {
        return request({
            url: path + "/reject/" + id,
            method: "put",
            params: {
                reason: reason
            }
        })
    }
}