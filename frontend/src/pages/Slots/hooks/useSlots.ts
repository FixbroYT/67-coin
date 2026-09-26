import { useEffect, useRef, useState } from "react"
import { useGame } from "../../../context/GameContext"

import { gameApi } from "../../../api/endpoints"
import { fetchToState } from "../../../api/dataFetcher"

import { fruits } from "../config"
import { Nullable } from "../../../types/Game"
import { SpinSlotsData } from "../../../types/Api"

import { styledToast } from "../../../components/styledToast"
import { formatNum } from "../../../utils/formatNum"


type reelIDUnion = 0 | 1 | 2
type phaseUnion = "accelerating" | "cruising" | "decelerating"

export function useSlots() {
    const { user, setUser, dailyStats, setDailyStats } = useGame()

    const [ stakeValue, setStakeValue ] = useState("")
    const [ hasError, setHasError ] = useState(false)

    const [ isSpinning, setIsSpinning ] = useState(false)
    const isSpinningRef = useRef(false)

    const [ fruitsId, setFruitsId ] = useState([0, 1, 2])
    const currentIndexesRef = useRef([0, 1, 2])

    const backendResultRef = useRef<Nullable<SpinSlotsData>>(null)

    const stopedReels = useRef(3)

    const phases = {
        accelerating: {duration: 500, delay: 100},
        cruising: {duration: "while server response", delay: 70},
        decelerating: {duration: "while correct fruit", delay: 130}
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (hasError) setHasError(false)

        if (value === "") {
            setStakeValue("")
            return
        }
    
        const intValue = Number.parseInt(value)
        if (!Number.isNaN(intValue)) setStakeValue(String(intValue))
        console.log(intValue)
    }

    const spin = (reelId: reelIDUnion) => {
        currentIndexesRef.current[reelId] = (currentIndexesRef.current[reelId] + 1) % fruits.length
        
        setFruitsId([...currentIndexesRef.current])
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const spinAnimation = async (reelId: reelIDUnion, currentDelay: number, phase: phaseUnion, phaseDuration: number) => {
        if (!isSpinningRef.current) return
        const backendData = backendResultRef.current

        spin(reelId)
        await delay(currentDelay)
        phaseDuration += currentDelay

        if (phase === "cruising") {
            if (backendData !== null) {
                spinAnimation(reelId, phases.decelerating.delay, "decelerating", 0)
                return
            }

            spinAnimation(reelId, phases.cruising.delay, "cruising", 0)
            return  
        } 
        else if (phase === "decelerating") {
            if (!backendData) return

            const targetFruit = backendData.combination[reelId]
            const nextDelay = currentDelay + 30
            
            const actualIndex = currentIndexesRef.current[reelId]
            const currentFruitOnScreen = fruits[actualIndex]

            if (currentFruitOnScreen === targetFruit) {
                stopedReels.current += 1
                
                if (stopedReels.current == 3) {
                    setIsSpinning(false)
                    isSpinningRef.current = false

                    const numericValue = Number(stakeValue)
                    const winAmount = backendData.win

                    if (winAmount > numericValue) {
                        styledToast("success", `Epic win!  +$${formatNum(winAmount)}`)
                    } else if (winAmount > 0) {
                        styledToast("success", `Got $${formatNum(winAmount)} back!`)
                    } else {
                        styledToast("error", "Better luck next time!")
                    }

                    setUser((prev) => prev ? { ...prev, coins: backendData.coins } : null)
                    setDailyStats((prev) => prev ? { ...prev, daily_deposit: backendData.daily_deposit } : null)
                }
                return
            }

            spinAnimation(reelId, nextDelay, phase, phaseDuration)
            return
        } 
        else {
            if (phaseDuration < phases[phase].duration) {
                spinAnimation(reelId, currentDelay, phase, phaseDuration)
            } else {
                spinAnimation(reelId, phases.cruising.delay, "cruising", 0)
                return
            }
        }
    }

    useEffect(() => {
        if (!isSpinningRef.current) return

        spinAnimation(0, phases.accelerating.delay, "accelerating", 0)
        setTimeout(() => spinAnimation(1, phases.accelerating.delay, "accelerating", 0), 250)
        setTimeout(() => spinAnimation(2, phases.accelerating.delay, "accelerating", 0), 500)

    }, [isSpinningRef.current])

    const setSlotsData = (data: SpinSlotsData) => {
        backendResultRef.current = data
    }

    const handleSubmit = async () => {
        if (!dailyStats || !user) return

        const numericValue = Number(stakeValue)
        if (!numericValue || numericValue < dailyStats.min_bet || numericValue > dailyStats.max_bet || user.coins < numericValue) {
            setHasError(true)
            return
        }

        setHasError(false)
        setIsSpinning(true)
        isSpinningRef.current = true
        stopedReels.current = 0

        backendResultRef.current = null
        setUser((prev) => prev ? { ...prev, coins: user.coins - numericValue } : null)

        try {
            await Promise.all([
                fetchToState(() => gameApi.spinSlots(numericValue), setSlotsData, false),
                delay(1500)
            ])
        } catch (error) {
            setIsSpinning(false)
            isSpinningRef.current = false
            styledToast("error", "Not enough coins! Lower your stake or level up.")
        }
    }

    return { handleChange, handleSubmit, stakeValue, setStakeValue, hasError, fruitsId, isSpinning }
}