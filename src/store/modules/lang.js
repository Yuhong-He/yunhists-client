export default {
    namespaced: true,
    state: {
        prefLang: ''
    },
    mutations: {
        setLang(state, payload) {
            state.prefLang = payload;
        }
    }
}