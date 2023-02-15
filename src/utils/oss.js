import store from "@/store";
import api from "@/api";
import {authError} from "@/utils/user";

export const oss = {
    region: "oss-cn-hongkong",
    accessKeyId: store.state.Aliyun.accessKeyId,
    accessKeySecret: store.state.Aliyun.accessKeySecret,
    stsToken: store.state.Aliyun.stsToken,
    bucket: "yunhists",
    refreshSTSToken: async () => {
        const res = await api.refreshSTS();
        if(res.data.code === 200) {
            store.state.Aliyun.accessKeyId = res.data.data.sts.accessKeyId;
            store.state.Aliyun.accessKeySecret = res.data.data.sts.accessKeySecret;
            store.state.Aliyun.stsToken = res.data.data.sts.stsToken;
            return {
                accessKeyId: res.data.data.sts.accessKeyId,
                accessKeySecret: res.data.data.sts.accessKeySecret,
                stsToken: res.data.data.sts.stsToken,
            };
        } else {
            authError(res.data.code);
        }
    }
};