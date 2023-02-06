export default {
    namespaced: true,
    state: {
        userId: '',
        username: '',
        email: '',
        userRights: '',
        points: ''
    },
    mutations: {
        setUserId(state, payload) {
            state.userId = payload;
        },
        setUsername(state, payload) {
            state.username = payload;
        },
        setEmail(state, payload) {
            state.email = payload;
        },
        setUserRights(state, payload) {
            state.userRights = payload;
        },
        setPoints(state, payload) {
            state.points = payload;
        }
    }
}