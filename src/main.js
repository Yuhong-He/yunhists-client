import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css'

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
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
