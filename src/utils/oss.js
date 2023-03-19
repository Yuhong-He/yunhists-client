import store from "@/store";
import api from "@/api";
import {generalError, unexpectedError} from "@/utils/general";

export const ossConfig = {
    endpoint: "oss.yunnanhistory.com",
    bucket: "yunhists",
    cname: true,
    get accessKeyId() {
        return store.state.Aliyun.accessKeyId;
    },
    get accessKeySecret() {
        return store.state.Aliyun.accessKeySecret;
    },
    get stsToken() {
        return store.state.Aliyun.stsToken;
    },
    refreshSTSToken: async () => {
        try {
            const res = await api.refreshSTS();
            if(res.data.code === 200) {
                store.commit('Aliyun/setAccessKeyId', res.data.data.sts.accessKeyId);
                store.commit('Aliyun/setAccessKeySecret', res.data.data.sts.accessKeySecret);
                store.commit('Aliyun/setStsToken', res.data.data.sts.stsToken);
                return {
                    accessKeyId: res.data.data.sts.accessKeyId,
                    accessKeySecret: res.data.data.sts.accessKeySecret,
                    stsToken: res.data.data.sts.stsToken,
                };
            } else {
                generalError(res.data);
            }
        } catch (e) {
            unexpectedError(e);
        }
    }
};