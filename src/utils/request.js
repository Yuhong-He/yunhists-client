import axios from "axios";
import {Loading, Message} from "element-ui";
import Vue from "vue";
import i18n from "@/lang";
import router from "@/router";
import store from "@/store";
import {cleanUserInfo, refreshUserToken} from "@/utils/user";
import {unexpectedError} from "@/utils/general";

const Base_URL = 'http://localhost:9999/api'; // local
// const Base_URL = 'https://api.yunnanhistory.com/api'; // server

const service = axios.create({
    timeout: 5000,
    responseType: "json",
    baseURL: Base_URL,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

const isTokenExpired = () => {
    let expireTime = store.state.User.expiredTime;
    if (expireTime) {
        let nowTime = new Date().getTime();
        return nowTime > expireTime; // expired: true
    } else {
        return false; // case expireTime empty, user not login
    }
}
let isRefreshing = false
let subscribers = []

function onAccessTokenFetched(newToken) {
    subscribers.forEach((callback) => {
        callback(newToken)
    })
    subscribers = []
}

function addSubscriber(callback) {
    subscribers.push(callback)
}

service.interceptors.request.use(
    config => {
        config.headers['AccessToken'] = store.state.User.accessToken;
        if (isTokenExpired()) {
            if (!isRefreshing) {
                isRefreshing = true
                let loadingInstance = Loading.service({ fullscreen: true });
                axios({
                    url: '/user/refreshToken',
                    method: 'post',
                    data: store.state.User.refreshToken,
                    baseURL: Base_URL,
                    timeout: 5000,
                }).then(res => {
                    isRefreshing = false;
                    loadingInstance.close();
                    if (res.data.code === 200) {
                        refreshUserToken(res.data.data);
                        onAccessTokenFetched(res.data.data.access_token);
                    } else {
                        Message.error(i18n.tc('util.request.loginAgain'));
                        toLoginPage();
                    }
                }).catch(res => {
                    isRefreshing = false;
                    loadingInstance.close();
                    unexpectedError(res);
                })
            }

            return new Promise((resolve) => {
                addSubscriber((newToken) => {
                    config.headers['AccessToken'] = newToken;
                    config.url = config.url.replace(config.baseURL, '')
                    resolve(config)
                })
            })
        }
        return config
    },
    error => {
        Message({
            showClose: true,
            message: error,
            type: "warning"
        });
        return Promise.reject(error);
    }
)

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
        if(error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes("timeout")) {
            Vue.prototype.$alert(i18n.tc('util.request.timeout'), {
                confirmButtonText: i18n.tc('header.confirm'),
                callback: () => {}
            }).then(() => {});
        } else {
            Vue.prototype.$alert(i18n.tc('util.request.unexpectedError'), {
                confirmButtonText: i18n.tc('header.confirm'),
                callback: () => {}
            }).then(() => {});
        }
        return Promise.reject(error.response);
    });

function toLoginPage() {
    cleanUserInfo();
    if(router.currentRoute.path !== '/login') {
        router.push('/login');
    }
}

export default service;