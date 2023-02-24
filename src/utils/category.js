import i18n from "@/lang";

export function generateErrorMsg(val, selectedCats, selectedTheses, newCategories) {
    let msg = "<p><span style='font-weight: bold'>" + i18n.tc('category.followingFails') +
        "</span></p><p><ul style='list-style-type: circle;'>";
    val.forEach(ele => {
        if(ele.type === 0) { // case thesis
            if (ele.reason === 2) { // parent cat not exist
                const parentCat = getCatName(ele.catToId, newCategories);
                msg += "<li>" + i18n.tc('category.selectedCat') + "<span style='font-weight: bold; color: darkgreen;'>" +
                    parentCat + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
            } else if(ele.reason === 5) { // thesis not exist
                const thesis = getThesisName(ele.catFromId, selectedTheses);
                msg += "<li>选中的论文<span style='font-weight: bold; color: darkgreen;'>" +
                    thesis + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
            } else {
                const thesis = getThesisName(ele.catFromId, selectedTheses);
                const parentCat = getCatName(ele.catToId, newCategories);
                const reason = generateFailReason(ele.reason);
                msg += "<li><span style='font-weight: bold; color: darkgreen;'>" + thesis + "</span>" +
                    i18n.tc('category.connectTo') + "<span style='font-weight: bold; color: darkgreen;'>" +
                    parentCat + "</span>" + i18n.tc('category.failedBecause') + reason + "</li>";
            }

        } else if(ele.type === 1) { // case category
            if(ele.reason === 1) { // child cat not exist
                const childCat = getCatName(ele.catFromId, selectedCats);
                msg += "<li>" + i18n.tc('category.selectedCat') + "<span style='font-weight: bold; color: darkgreen;'>" +
                    childCat + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
            } else if (ele.reason === 2) { // parent cat not exist
                const parentCat = getCatName(ele.catToId, newCategories);
                msg += "<li>" + i18n.tc('category.selectedCat') + "<span style='font-weight: bold; color: darkgreen;'>" +
                    parentCat + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
            } else {
                const childCat = getCatName(ele.catFromId, selectedCats);
                const parentCat = getCatName(ele.catToId, newCategories);
                const reason = generateFailReason(ele.reason);
                msg += "<li><span style='font-weight: bold; color: darkgreen;'>" + childCat + "</span>" +
                    i18n.tc('category.connectTo') + "<span style='font-weight: bold; color: darkgreen;'>" +
                    parentCat + "</span>" + i18n.tc('category.failedBecause') + reason + "</li>";
            }
        }
    });
    msg += "</ul></p>";
    return msg;
}

function getCatName(val, obj) {
    let name = "ERROR";
    for(const ele of obj) {
        if(ele.id === val) {
            if(i18n.locale === "zh") {
                name = ele.zhName;
            } else {
                name = ele.enName;
            }
            break;
        }
    }
    return name;
}

function getThesisName(val, obj) {
    let name = "ERROR";
    for(const ele of obj) {
        if(ele.id === val) {
            name = ele.title;
            break;
        }
    }
    return name;
}

function generateFailReason(val) {
    if(val === 3) {
        return i18n.tc('category.canNotBeCatItself');
    } else if(val === 4) {
        return i18n.tc('category.relationExist');
    }
}