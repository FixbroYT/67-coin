import { useRef, useCallback, useState, useEffect } from 'react'
import { WSManager } from '../api/websocket';
import { SetState, Nullable, User } from '../types/Game';
import { Popup } from '../types/ClickerHook';
import { ProcessClickResp } from '../types/Api';


export function useClicker(setUser: SetState<Nullable<User>>, clickIncome: number) {
    const clickBuffer = useRef(0)
    const timerRef = useRef<Nullable<number>>(null)
    const [ popups, setPopups ] = useState<Popup[]>([])
    const popupToClean = useRef<number[]>([])
    const lastClickTime = useRef(0)

    const MIN_CLICK_INTERVAL = 70

    const handleDataUpdate = useCallback((data: ProcessClickResp) => {
        setUser((prev) => {
            if (!prev) return null
            
            return {
                ...prev,
                coins: data.coins,
                xp: data.xp,
                energy: data.energy,
                total_taps: data.total_taps
            }
        })
    }, [])

    useEffect(() => {
        const unsubscribe = WSManager.subscribe("click_resp", handleDataUpdate)

        return unsubscribe
    }, [handleDataUpdate])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    })

    useEffect(() => {
        return () => {
            popupToClean.current.forEach(id => clearTimeout(id))
        }
    })

    const flushClicks = useCallback(async () => {
        if (clickBuffer.current === 0) return

        const amount = clickBuffer.current
        clickBuffer.current = 0

        WSManager.send("click", { click_amount: amount })
    }, [])

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const now = Date.now()
        if (now - lastClickTime.current < MIN_CLICK_INTERVAL) {
            return
        }

        setUser(prev => {
            if (!prev) return null

            return {
                ...prev, 
                coins: prev.coins + clickIncome, 
                energy: prev.energy - 1
            }
        })

        const rect = event.currentTarget.getBoundingClientRect()
        const newPopup = {
            id: now,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            value: clickIncome
        }
        setPopups(prev => [...prev, newPopup])

        lastClickTime.current = now

        const poputTimer = setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== newPopup.id))
            popupToClean.current = popupToClean.current.filter(id => id !== poputTimer)
        }, 1000)
        
        clickBuffer.current += 1

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(flushClicks, 2000)

        if (clickBuffer.current >= 20) {    
            if (timerRef.current) clearTimeout(timerRef.current)
            flushClicks()
        }
    }, [flushClicks, setUser, clickIncome])

    return { handleClick, popups }
}