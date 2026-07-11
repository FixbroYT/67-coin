import { validateResponseSync } from "./validation"
import { createDefaultResponse, ProcessClick } from "../types/Api"

type WebSocketCallback = (data: any) => void

const API_URL = import.meta.env.VITE_API_URL

class WebSocketManager {
    private socket: WebSocket | null = null
    private url: string
    private subscribers: Map<string, WebSocketCallback[]> = new Map()
    
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectTimerId: number | null = null

    constructor(url: string) {
        this.url = url
    }

    public connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return

        this.socket = new WebSocket(this.url)

        this.socket.onopen = () => {
            console.log("Ws connected.")
            this.reconnectAttempts = 0
            this.clearReconnectTimer()
        }
        this.socket.onclose = (event) => {
            console.log(`Ws closed, ${event.reason}`)
            this.reconnectOnClose()
        }
        this.socket.onerror = (error) => console.error(error)

        this.socket.onmessage = (event) => {
            this.handleMessage(event.data)
        }
    } 

    public send(action: string, payload: object) {
        const message = JSON.stringify({ action: action, data: payload })

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message)
        } else {
            console.warn("A request for WebSocket access was received before the connection was opened; the message has been lost.")
        }
    }

    private handleMessage(rawData: string) {
        try {
            const parsed = JSON.parse(rawData)
            validateResponseSync(parsed, createDefaultResponse(ProcessClick))
            const { action, data } = parsed

            const callbacks = this.subscribers.get(action)
            if (callbacks) {
                callbacks.forEach(cb => cb(data))
            }
        } catch (error) {
            console.error(`Error ocured with handling server response: ${error}`)
        }
    }

    private reconnectOnClose() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return

        this.reconnectAttempts++
        console.log("Reconnect failed, retrying in 5 secs.")
    
        this.reconnectTimerId = setTimeout(() => {
            this.connect()
        }, 5000)
    }

    private clearReconnectTimer() {
        if (this.reconnectTimerId) {
            clearTimeout(this.reconnectTimerId)
            this.reconnectTimerId = null
        }
    }

    public subscribe(action: string, callback: WebSocketCallback) {
        if (!this.subscribers.has(action)) {
            this.subscribers.set(action, [])
        }
        this.subscribers.get(action)?.push(callback)

        return () => {
            const current = this.subscribers.get(action) || []
            this.subscribers.set(action, current.filter((cb) => cb !== callback))
        }
    }

    public disconnect() {
        this.socket?.close()
        this.socket = null
    }
}

const WSManager = new WebSocketManager(`${API_URL}/ws`)