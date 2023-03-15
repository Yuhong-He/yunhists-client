import store from "@/store";
import api from "@/api";
import {generalError, unexpectedError} from "@/utils/user";

export const oss = {
    region: "oss-cn-hongkong",
    accessKeyId: store.state.Aliyun.accessKeyId,
    accessKeySecret: store.state.Aliyun.accessKeySecret,
    stsToken: store.state.Aliyun.stsToken,
    bucket: "yunhists",
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