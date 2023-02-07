import store from "@/store";
import router from "@/router";
import Vue from "vue";
import i18n from "@/lang";
import {setToken} from "@/utils/token";

function authError(errorCode) {
    setToken("");
    store.state.UserInfo.userId = "";
    store.state.UserInfo.username = "";
    store.state.UserInfo.email = "";
    store.state.UserInfo.userRights = "";
    store.state.UserInfo.points = "";
    router.push('/login').then(() => printErrorMsg(errorCode));
}

function printErrorMsg(errorCode) {
    if(errorCode === 205) {
        Vue.prototype.$message.error(i18n.tc('util.user.noUser'));
    } else if (errorCode === 223) {
        Vue.prototype.$message.error(i18n.tc('util.user.tokenExpired'));
    } else if (errorCode === 224) {
        Vue.prototype.$message.error(i18n.tc('util.user.tokenError'));
    } else if (errorCode === 225) {
        Vue.prototype.$message.error(i18n.tc('util.user.missingToken'));
    } else {
        Vue.prototype.$message.error(i18n.tc('util.user.unknownError'));
    }
}

export {authError};