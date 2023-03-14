import axios from "axios";
import {getToken, setToken} from "@/utils/token";
import {Message} from "element-ui";
import Vue from "vue";
import i18n from "@/lang";
import router from "@/router";
import store from "@/store";

const service = axios.create({
    timeout: 5000,
    responseType: "json",
    baseURL: 'http://localhost:9999/api',
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

service.interceptors.request.use(
    config => {
        config.headers['token'] = getToken();
        return config;
    },
    error => {
        Message({
            showClose: true,
            message: error,
            type: "warning"
        });
        return Promise.reject(error);
    })

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.code === 201) { // custom response code
                Message.error(i18n.tc('util.request.serverError'));
                return Promise.reject(response);
            } else if(response.data.code === 203) {
                Message.error(i18n.tc('util.request.noPermission'));
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 205) {
                Message.error(i18n.tc('util.request.noUser'));
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 223) {
                Message.error(i18n.tc('util.request.tokenExpired'));
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 224) {
                Message.error(i18n.tc('util.request.tokenError'));
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 225) {
                Message.error(i18n.tc('util.request.missingToken'));
                toLoginPage();
                return Promise.resolve(response);
            } else {
                return Promise.resolve(response);
            }
        } else {
            Vue.prototype.$alert(i18n.tc('util.request.unexpectedError'), {
                confirmButtonText: i18n.tc('header.confirm'),
                callback: () => {}
            }).then(() => {});
            return Promise.reject(response);
        }
    },
    error => {
        Vue.prototype.$alert("未知错误", {
            confirmButtonText: i18n.tc('header.confirm'),
            callback: () => {}
        }).then(() => {});
        return Promise.reject(error.response);
    });

function toLoginPage() {
    setToken("");
    store.commit('UserInfo/setUsername',"");
    store.commit('UserInfo/setUserRights',"");
    store.commit('Aliyun/setAccessKeyId',"");
    store.commit('Aliyun/setAccessKeySecret',"");
    store.commit('Aliyun/setStsToken',"");
    if(router.currentRoute.path !== '/login') {
        router.push('/login');
    }
}

export default service;