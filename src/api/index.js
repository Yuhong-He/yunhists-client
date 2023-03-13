import user from './user'
import category from './category'
import thesis from './thesis'
import upload from './upload'
import statistics from './statistics'

export const BASE_URL = "http://localhost:9999/api";

const api = {
    ...user,
    ...category,
    ...thesis,
    ...upload,
    ...statistics,
}

export default api;