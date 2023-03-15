export default {
    namespaced: true,
    state: {
        username: '',
        userRights: '',
        accessToken: '',
        refreshToken: '',
        expiredTime: ''
    },
    mutations: {
        setUsername(state, payload) {
            state.username = payload;
        },
        setUserRights(state, payload) {
            state.userRights = payload;
        },
        setAccessToken(state, payload) {
            state.accessToken = payload;
        },
        setRefreshToken(state, payload) {
            state.refreshToken = payload;
        },
        setExpiredTime(state, payload) {
            state.expiredTime = payload;
        }
    }
}