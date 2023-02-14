import store from "@/store";

export const oss = {
    region: "oss-cn-hongkong",
    accessKeyId: store.state.Aliyun.accessKeyId,
    accessKeySecret: store.state.Aliyun.accessKeySecret,
    stsToken: store.state.Aliyun.stsToken,
    bucket: "yunhists"
};