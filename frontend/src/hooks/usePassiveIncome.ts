import { useEffect } from 'react'
import { User, Nullable, SetState } from "../types/Game"


export function usePassiveIncome(setUser: SetState<Nullable<User>>) {
    useEffect(() => {
        const interval = setInterval(() => {
            
            setUser(prev => {
                if (!prev) return null

                return { ...prev, coins: prev.coins + prev.passive_income }
            })
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })
}