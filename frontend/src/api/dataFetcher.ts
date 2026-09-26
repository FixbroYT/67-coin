import { SetState } from "../types/Game"
import { ResponseUnion } from "../types/Api"
import { styledToast } from "../components/styledToast"

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fetchWithRetries = async <T> (apiCall: () => Promise<ResponseUnion<T>| undefined>, retriesRemain: number = 5) => {
    try {
        const response = await apiCall()
        if (!response) throw new Error(`Retry failed, remaining retries: ${retriesRemain}.`)

        return response
    } catch (e) {
        console.error(e)

        if (retriesRemain <= 1) return
        await delay(5000)
        return await fetchWithRetries(apiCall, retriesRemain - 1)
    }
}

export const fetchToState = async <T> (apiCall: () => Promise<ResponseUnion<T>| undefined>, onSuccess: (data: T) => void | SetState<T>, retriesNeeded: boolean = true) => {
    try {
        const response = await fetchWithRetries(apiCall, retriesNeeded ? 5 : 0)

        if (!response) {
            styledToast("error", "Data processing error. Please try again later.")
            return false
        }
        
        if (response.success) {
            onSuccess(response.data)
            return response.data
        }

        console.warn(`Business logic error: ${response.error.message}`)
        styledToast("error", response.error.message)
    } catch (e) {
        console.error("Critical fetch error: ", e) 
        styledToast("error", "Something went wrong. Please try again later.")
    }
}