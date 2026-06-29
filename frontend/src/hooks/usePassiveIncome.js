import { useEffect, useRef } from 'react'

export function usePassiveIncome(passiveIncome, setUser) {
    const intervalRef = useRef(null)

    useEffect(() => {
        if (!passiveIncome) return

        intervalRef.current = setInterval(() => {
            setUser(prev => ({ ...prev, coins: prev.coins + passiveIncome }))
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [passiveIncome, setUser])
}

export function useEnergyRecovery(setUser, max_energy) {
    const maxEnergyRef = useRef(max_energy);
    
    useEffect(() => {
        maxEnergyRef.current = max_energy;
    }, [max_energy]);

    useEffect(() => {
        const interval = setInterval(() => {
            setUser(prev => {
                if (!prev) return prev;
                
                if (prev.energy >= maxEnergyRef.current) return prev;

                return {
                    ...prev,
                    energy: Math.min(prev.energy + 1, maxEnergyRef.current)
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setUser]);
}