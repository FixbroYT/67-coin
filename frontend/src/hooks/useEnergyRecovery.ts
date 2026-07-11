import { useEffect, useRef } from 'react'
import { User, Nullable, SetState } from "../types/Game"

export function useEnergyRecovery(setUser: SetState<Nullable<User>>, user: Nullable<User>) {
    const userRef = useRef<Nullable<User>>(user)
    
    useEffect(() => {
        userRef.current = user
    }, [user])

    useEffect(() => {
        const interval = setInterval(() => {
            const currentUser = userRef.current

            if (!currentUser) return

            setUser(prev => {
                if (!prev) return prev

                const maxEnergy = currentUser.max_energy
                const restoration = currentUser.energy_restoration
                
                if (prev.energy >= maxEnergy) return prev

                return {
                    ...prev,
                    energy: Math.min(prev.energy + restoration, maxEnergy)
                }
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [setUser])
}