import Vue from 'vue'
import Vuex from 'vuex'
import Settings from './modules/settings';
import User from './modules/user';
import Aliyun from "@/store/modules/aliyun";
import createPersistedstate from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Settings,
    User,
    Aliyun
  },
  plugins: [
    createPersistedstate({
      key: 'Yunhists',
      paths: ['Settings', 'User', 'Aliyun']
    })
  ]
})
