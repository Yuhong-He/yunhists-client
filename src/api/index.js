import axios from 'axios';

const BASE_URL = "http://localhost:9999/api";

const api = {
    login(data) {
        return axios({
            url: BASE_URL + "/user/login",
            method: "post",
            params: data
        })
    }
}

export default api;