import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(
    (config) => {
        const tgInitData = (window as any).Telegram?.WebApp?.initData

        if (tgInitData) {
            config.headers["X-Init-Data"] = tgInitData
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)