import store from "@/store";
import router from "@/router";
import Vue from "vue";
import i18n from "@/lang";
import {setToken} from "@/utils/token";

function generalError(data) {
    if(data.code === 201) {
        console.log(data.data);
        Vue.prototype.$alert("Unexpected Error", {
            confirmButtonText: i18n.tc('header.confirm'),
            customClass: 'unexpected-alert-box',
            callback: () => {}
         }).then(() => {});
    } else {
        setToken("");
        store.state.UserInfo.userId = "";
        store.state.UserInfo.username = "";
        store.state.UserInfo.email = "";
        store.state.UserInfo.userRights = "";
        store.state.UserInfo.points = "";
        store.state.Aliyun.accessKeyId = "";
        store.state.Aliyun.accessKeySecret = "";
        store.state.Aliyun.stsToken = "";
        if(router.currentRoute.path !== '/login') {
            router.push('/login').then(() => printErrorMsg(data.code));
        }
    }
}

function printErrorMsg(errorCode) {
    if(errorCode === 205) {
        Vue.prototype.$message.error(i18n.tc('util.user.noUser'));
    } else if (errorCode === 203) {
        Vue.prototype.$message.error(i18n.tc('util.user.noPermission'));
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

export {generalError};