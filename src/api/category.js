import request from "@/utils/request";

const path = "/category";

export default {
    getCategoryOption(catName, lang) {
        return request({
            url: path + "/option/" + catName + "/" + lang,
            method: "get"
        })
    },
    addCategory(data) {
        return request({
            url: path + "/add",
            method: "post",
            data: data
        })
    },
    getCategoryList(lang, page, pageSize, query, sortCol, sortOrder) {
        return request({
            url: path + "/list/" + lang +"/" + page + "/" + pageSize,
            method: "get",
            params: {
                name: query,
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    addCatALot(data) {
        return request({
            url: path + "/addCatALot",
            method: "put",
            data: data
        })
    },
    getCategoryByIds(ids) {
        return request({
            url: path + "/ids",
            method: "get",
            params: {
                ids: ids
            }
        })
    },
    getCategoryInfo(id) {
        return request({
            url: path + "/id/" + id,
            method: "get"
        })
    },
    getCategoryParentCats(id) {
        return request({
            url: path + "/parentCats/" + id,
            method: "get"
        })
    },
    getCategoryChildCats(id, sortCol, sortOrder) {
        return request({
            url: path + "/childCat/" + id,
            method: "get",
            params: {
                sortCol: sortCol,
                sortOrder: sortOrder
            }
        })
    },
    updateCategoryName(id, zhName, enName) {
        return request({
            url: path + "/updateCatName/" + id,
            method: "put",
            params: {
                zhName: zhName,
                enName: enName
            }
        })
    },
    updateCatParentCat(id, lang, categories) {
        return request({
            url: path + "/updateCatParentCat/" + id,
            method: "put",
            params: {
                lang: lang,
                categories: categories
            }
        })
    },
    removeFromCat(id, subCats, subTheses) {
        return request({
            url: path + "/removeFromCat/" + id,
            method: "delete",
            params: {
                subCats: subCats,
                subTheses: subTheses
            }
        })
    },
    moveTo(originId, destId, subCats, subTheses) {
        return request({
            url: path + "/moveTo",
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
        return request({
            url: path + "/delete/" + catId,
            method: "delete"
        })
    },
    getCatWithoutCat() {
        return request({
            url: path + "/catWithoutCat",
            method: "get"
        })
    },
    getEmptyCat() {
        return request({
            url: path + "/emptyCat",
            method: "get"
        })
    }
}