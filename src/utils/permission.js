import store from "@/store";
import Vue from "vue";
import i18n from "@/lang";

const unregistered = [
    'Home',
    'Login',
    'Thesis',
    'ThesisList',
    'Category',
    'CategoryList',
    'CategoryId',
    'CategoryDetail',
    'Statistics',
    'About',
    'TermsOfService',
    'PrivacyPolicy',
    'NotFound'
]

const user = [
    'AddUpload',
    'Profile',
    'UserInfo',
    'MyUpload',
    'UpdateUpload'
]

const admin = [
    'ThesisAdd',
    'UpdateThesis',
    'CategoryAdd',
    'Admin',
    'UploadList',
    'ApproveUpload',
    'Maintain',
    'MissingFile',
    'NoCatThesis',
    'NoCatCat',
    'NoChildCat'
]

export function validatePermission(to, from, next) {
    const userName = store.state.User.username;
    const userRights = store.state.User.userRights;
    if (userName.length > 0) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if(unregistered.indexOf(to.name) >= 0 || user.indexOf(to.name) >= 0) {
                next()
            } else if(admin.indexOf(to.name) >= 0) {
                if (userRights >= 1) {
                    next()
                } else {
                    Vue.prototype.$message.error(i18n.tc('util.permission.noPermission'));
                    next(`/`);
                }
            }
        }
    } else {
        if (unregistered.indexOf(to.name) !== -1) {
            next();
        } else {
            Vue.prototype.$message.error(i18n.tc('util.permission.noLogin'));
            next(`/login`);
        }
    }
}