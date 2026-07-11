import { useRef, useCallback, useState } from 'react'

import { SetState, Nullable, User } from '../types/Game';
import { Popup } from '../types/ClickerHook';


export function useClicker(setUser: SetState<Nullable<User>>, clickIncome: number) {
    const clickBuffer = useRef(0)
    const timerRef = useRef<Nullable<number>>(null)
    const [ popups, setPopups ] = useState<Popup[]>([])
    const lastClickTime = useRef(0)

    const MIN_CLICK_INTERVAL = 70

    const flushClicks = useCallback(async () => {
        if (clickBuffer.current === 0) return

        const amount = clickBuffer.current
        clickBuffer.current = 0

        const data = await processClick(tg_id, amount)
        if (data) {
            setUser(prev => ({ 
                ...prev, 
                coins: data.coins, 
                xp: data.xp, 
                energy: data.energy, 
                total_taps: data.total_taps,
                lvl: Math.floor(data.xp / 1000)
            }))
        }
    }, [tg_id, setUser])

    const handleClick = useCallback((e) => {
        const now = Date.now()
        if (now - lastClickTime.current < MIN_CLICK_INTERVAL) {
            return
        }

        setUser(prev => ({ ...prev, coins: prev.coins + clickIncome, energy: prev.energy - 1 }))

        const newPopup = {
            id: now,
            x: e.clientX,
            y: e.clientY,
            value: clickIncome
        }
        setPopups(prev => [...prev, newPopup])

        lastClickTime.current = now

        setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== newPopup.id))
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