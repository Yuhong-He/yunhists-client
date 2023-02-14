export default {
    namespaced: true,
    state: {
        accessKeyId: '',
        accessKeySecret: '',
        stsToken: ''
    },
    mutations: {
        setAccessKeyId(state, payload) {
            state.accessKeyId = payload;
        },
        setAccessKeySecret(state, payload) {
            state.accessKeySecret = payload;
        },
        setStsToken(state, payload) {
            state.stsToken = payload;
        }
    }
}