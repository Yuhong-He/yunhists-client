import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css'
import i18n from './lang/index'
import api from './api'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faLanguage,
    faEllipsisVertical,
    faMagnifyingGlass,
    faBookOpen,
    faHouse,
    faFolderTree,
    faUser,
    faRightToBracket,
    faGear
} from '@fortawesome/free-solid-svg-icons';
import {
    faCopyright
} from '@fortawesome/free-regular-svg-icons';
import {
    faGoogle
} from '@fortawesome/free-brands-svg-icons';
library.add(faCopyright);
library.add(faLanguage);
library.add(faEllipsisVertical);
library.add(faMagnifyingGlass);
library.add(faBookOpen);
library.add(faHouse);
library.add(faFolderTree);
library.add(faUser);
library.add(faRightToBracket);
library.add(faGear);
library.add(faGoogle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.prototype.$api = api;

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if(store.state.lang.prefLang && store.state.lang.prefLang.length > 0) {
        i18n.locale = store.state.lang.prefLang;
    } else {
        i18n.locale = "zh";
    }
    next()
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')