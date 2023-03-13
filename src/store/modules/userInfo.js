export default {
    namespaced: true,
    state: {
        username: '',
        userRights: ''
    },
    mutations: {
        setUsername(state, payload) {
            state.username = payload;
        },
        setUserRights(state, payload) {
            state.userRights = payload;
        }
    }
}