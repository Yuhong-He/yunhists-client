export default {
    namespaced: true,
    state: {
        lang: '',
        categoryListTips: ''
    },
    mutations: {
        setLang(state, payload) {
            state.lang = payload;
        },
        setCategoryListTips(state, payload) {
            state.categoryListTips = payload;
        }
    }
}