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

// banner txt
console.log(
    " __   __                  _       _         _         \n" +
    " \\ \\ / /  _   _   _ __   | |__   (_)  ___  | |_   ___ \n" +
    "  \\ V /  | | | | | '_ \\  | '_ \\  | | / __| | __| / __|\n" +
    "   | |   | |_| | | | | | | | | | | | \\__ \\ | |_  \\__ \\\n" +
    "   |_|    \\__,_| |_| |_| |_| |_| |_| |___/  \\__| |___/\n" +
    "                                                      \n" +
    "-------------------------------------------------------\n" +
    "                                                      \n" +
    "感谢您访问我的网站，本人不谙CSS样式。如您有意愿帮助提升本站的UI，欢迎联系本人，不胜感激！\n" +
    "Thanks for visiting my site, I am not familiar with CSS styling. If you are willing to help improve the UI of this site, please contact me, thank you very much!"
)

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')