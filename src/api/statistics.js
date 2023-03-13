import axios from "axios";
import {BASE_URL} from "@/api/index";

const path = "/statistics";

export default {
    getStatisticsData() {
        return axios({
            url: BASE_URL + path,
            method: "get"
        })
    }
}