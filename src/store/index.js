import Vue from 'vue'
import Vuex from 'vuex'
import lang from './modules/lang';
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
    lang
  },
  plugins: [
    createPersistedstate({
      key: 'UserInfo',
      paths: ['lang']
    })
  ]
})
