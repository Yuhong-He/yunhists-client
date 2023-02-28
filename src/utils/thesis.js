import i18n from "@/lang";
import Vue from "vue";

export function handleThesisIssue(thesisIssue) {
    let str = "";
    if(thesisIssue.year !== "") {
        str += thesisIssue.year;
    }
    if(thesisIssue.volume !== "") {
        str += ",";
        str += thesisIssue.volume;
    }
    if(thesisIssue.issue !== "") {
        str += "(";
        str += thesisIssue.issue;
        str += ")";
    }
    return str;
}

export function validateThesis(val) {
    if(!val.title.length > 0) {
        Vue.prototype.$alert(i18n.tc('thesis.inputTitle'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
        }).then(() => {});
        return false;
    }
    if(val.volume !== "") {
        if(isNaN(Number(val.volume))) {
            Vue.prototype.$alert(i18n.tc('thesis.volumeIsNum'), {
                confirmButtonText: i18n.tc('thesis.confirm'),
                callback: () => {}
            }).then(() => {});
            return false;
        }
    }
    if(!(val.fileName && val.fileName.length > 0)) {
        Vue.prototype.$alert(i18n.tc('thesis.pleaseUploadFile'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
        }).then(() => {});
        return false;
    }
    return true;
}
