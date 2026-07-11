import { Info } from "lucide-react"
import Header from "../../components/Header"
import { useEffect, useRef, useState } from "react"
import { spinSlots } from "../../api/client"
import { useGame } from "../../context/GameContext"
import { Toaster } from "react-hot-toast"
import { styledToast } from "../components/styledToast"
import { formatNum } from "../../utils/formatNum"

const fruits = ['🍍', '🍌', '🍎', '🥝', '🍇', '🍊', '🍉']

const Slot = ({ contentId }) => {
    const len = fruits.length
    return (
        <div className="h-full w-[28%] rounded-3xl bg-[#1c2028]/40 border border-white/5 shadow-md flex items-center justify-center flex-col gap-5 overflow-hidden py-2 select-none">
            <span className="text-3xl opacity-20 filter blur-[0.5px]">{fruits[(contentId - 1 + len) % len]}</span>
            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{fruits[contentId]}</span>
            <span className="text-3xl opacity-20 filter blur-[0.5px]">{fruits[(contentId + 1) % len]}</span>
        </div>
    )
}

const StakeButton = ({ onClick, label }) => {
    return (
        <button className="bg-[#1c2028] w-23 h-10 rounded-3xl m-2 text-white tracking-wider font-medium active:scale-95 duration-150" onClick={onClick}>
            {label}
        </button>
    )
}

export default function Slots() {
    const { user, setUser } = useGame()

    const [ stakeValue, setStakeValue ] = useState("")
    const [ hasError, setHasError ] = useState(false)

    const [ isSpinning, setIsSpinning ] = useState(false)
    const isSpinningRef = useRef(false)

    const [ fruitsId, setFruitsId ] = useState([0, 1, 2])
    const currentIndexesRef = useRef([0, 1, 2])

    const backendResultRef = useRef(null)

    const stopedReels = useRef(3)
    
    const min = user?.min_bet
    const max = user?.max_bet

    const phases = {
        accelerating: {duration: 500, delay: 100},
        cruising: {duration: "while server response", delay: 70},
        decelerating: {duration: "while correct fruit", delay: 130}
    }

    const handleChange = (event) => {
        if (hasError) setHasError(false)
        setStakeValue(event.target.value)
    }

    const spin = (reelId) => {
        currentIndexesRef.current[reelId] = (currentIndexesRef.current[reelId] + 1) % fruits.length
        
        setFruitsId([...currentIndexesRef.current])
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const spinAnimation = async (reelId, currentDelay, phase, phaseDuration) => {
        if (!isSpinningRef.current) return

        spin(reelId)
        await delay(currentDelay)
        phaseDuration += currentDelay

        if (phase === "cruising") {
            if (backendResultRef.current !== null) {
                spinAnimation(reelId, phases.decelerating.delay, "decelerating", 0)
                return
            }

            spinAnimation(reelId, phases.cruising.delay, "cruising", 0)
            return  
        } 
        else if (phase === "decelerating") {
            const targetFruit = backendResultRef.current.combination[reelId]
            const nextDelay = currentDelay + 30
            
            const actualIndex = currentIndexesRef.current[reelId]
            const currentFruitOnScreen = fruits[actualIndex]

            if (currentFruitOnScreen === targetFruit) {
                stopedReels.current += 1
                
                if (stopedReels.current == 3) {
                    setIsSpinning(false)
                    isSpinningRef.current = false

                    const winAmount = backendResultRef.current.win

                    if (winAmount > stakeValue) {
                        styledToast("success", `Epic win!  +$${formatNum(winAmount)}`)
                    } else if (winAmount > 0) {
                        styledToast("sucess", `Got $${formatNum(winAmount)} back!`)
                    } else {
                        styledToast("error", "Better luck next time!")
                    }

                    setUser((prev) => ({
                        ...prev, coins: backendResultRef.current.coins, daily_deposit: backendResultRef.current.daily_deposit
                    }))
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

    const handleSubmit = async () => {
        const numericValue = Number(stakeValue)
        if (!numericValue || numericValue < min || numericValue > max || user?.coins < stakeValue) {
            setHasError(true)
            return
        }

        setHasError(false)
        setIsSpinning(true)
        isSpinningRef.current = true
        stopedReels.current = 0

        backendResultRef.current = null
        const user_old_balance = user?.coins
        setUser((prev) => ({...prev, coins: user?.coins - stakeValue}))

        try {
            const [ backendResponse ] = await Promise.all([
                spinSlots(user?.tg_id, numericValue),
                delay(1500)
            ])
            
            backendResultRef.current = backendResponse
        } catch (error) {
            setIsSpinning(false)
            isSpinningRef.current = false
            styledToast("error", "Not enough coins! Lower your stake or level up.")
        }
    }

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta ">
            <Header />

            <div className="w-full h-70 rounded-4xl drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] p-5 flex justify-center" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
                <Slot contentId={fruitsId[0]} />
                <Slot contentId={fruitsId[1]} />
                <Slot contentId={fruitsId[2]} />
            </div>

            <div className="w-full h-52 bg-[#161a21] my-5 p-5 rounded-3xl flex flex-col">
                <span className="flex justify-between">
                    <span className="uppercase text-[#95979f] text-xs font-semibold tracking-wider">Stake Amount</span>
                    <span className="uppercase text-[#b6a0ff] text-xs font-semibold tracking-wider">Min: {formatNum(min, true)} Max: {formatNum(max, true)}</span>
                </span>
                <input type="number" id="stake" onChange={handleChange} value={stakeValue} className="h-15 w-full rounded-3xl tracking-wide flex items-center outline-0 px-5 mt-4 text-xl text-white font-semibold border border-white/10 placeholder:text-sm" placeholder="Enter amount..." />
                {hasError && (
                    <span className="text-sm tracking-wide text-red-400">Invalid input</span>
                )}

                <div className="w-full flex justify-between">
                    <StakeButton onClick={() => setStakeValue((prev) => prev * 0.3 >= min ? Math.floor(prev * 0.3) : min)} label="1/3" />
                    <StakeButton onClick={() => setStakeValue((prev) => prev * 2 <= max ? Math.floor(prev * 2) : max)} label="x2" />
                    <StakeButton onClick={() => setStakeValue(max)} label="Max" />
                </div>
            </div> 
            <button className="w-full h-15 rounded-full bg-gradient-purple drop-shadow-[0_0_10px_rgba(126,81,255,0.3)] duration-150 active:scale-98 uppercase text-[#280072] font-semibold text-xl tracking-wider disabled:opacity-40 disabled:active:scale-100" onClick={handleSubmit} disabled={isSpinning}>
                spin
            </button>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}