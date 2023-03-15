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
    },
    actions: {
        checkAccessKeyId({ state }) {
            return new Promise((resolve, reject) => {
                let counter = 0;
                const intervalId = setInterval(() => {
                    const accessKeyId = state.accessKeyId;
                    if (accessKeyId) {
                        clearInterval(intervalId);
                        resolve();
                    } else if (counter >= 50) {
                        clearInterval(intervalId);
                        reject(new Error('Aliyun token error'));
                    }
                    counter++;
                }, 100);
            });
        }
    }
}