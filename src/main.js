import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/fontawesome'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css'
import i18n from './lang/index'
import api from './api'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;
Vue.prototype.$api = api;

Vue.use(VueClipboard);

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if(store.state.Settings.lang && store.state.Settings.lang.length > 0) {
        i18n.locale = store.state.Settings.lang;
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