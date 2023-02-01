export default {
    namespaced: true,
    state: {
        userId: '',
        username: '',
        userRights: '',
        token: ''
    },
    mutations: {
        setUserId(state, payload) {
            state.userId = payload;
        },
        setUsername(state, payload) {
            state.username = payload;
        },
        setUserRights(state, payload) {
            state.userRights = payload;
        },
        setToken(state, payload) {
            state.token = payload;
        }
    }
}