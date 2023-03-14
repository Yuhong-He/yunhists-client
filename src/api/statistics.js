import request from "@/utils/request";

const path = "/statistics";

export default {
    getStatisticsData() {
        return request({
            url: path,
            method: "get"
        })
    }
}