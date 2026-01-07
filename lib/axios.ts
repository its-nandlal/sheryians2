import axios from "axios"

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    headers: {
        'Content-Type': 'multipart/form-data',
    }
})


api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            window.location.href = "/"
        }

        return Promise.reject(error)
    }
)