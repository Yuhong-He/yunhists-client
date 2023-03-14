import user from './user'
import category from './category'
import thesis from './thesis'
import upload from './upload'
import statistics from './statistics'

const api = {
    ...user,
    ...category,
    ...thesis,
    ...upload,
    ...statistics,
}

export default api;