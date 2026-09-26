import { useGame } from "../../context/GameContext"
import { useSlots } from "./hooks/useSlots"
import { useEffect } from "react"

import { fetchToState } from "../../api/dataFetcher"
import { gameApi } from "../../api/endpoints"

import Header from "../../components/Header"
import Reel from "./components/Reel"
import StakeButton from "./components/StakeButton"
import LoadingScreen from "../../components/LoadingScreen"

import { formatNum } from "../../utils/formatNum"

export default function Slots() {
    const { user, dailyStats, setDailyStats } = useGame()
    const { handleChange, handleSubmit, stakeValue, setStakeValue, hasError, fruitsId, isSpinning } = useSlots()

    useEffect(() => {
        if (dailyStats) return

        fetchToState(gameApi.getDailyStats, setDailyStats)
    }, [])

    if (!user || !dailyStats) return <LoadingScreen />

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta ">
            <Header />

            <div className="w-full h-70 rounded-4xl drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] p-5 flex justify-center" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
                <Reel contentId={fruitsId[0]} />
                <Reel contentId={fruitsId[1]} />
                <Reel contentId={fruitsId[2]} />
            </div>  

            <div className="w-full bg-[#161a21] my-5 p-5 rounded-3xl flex flex-col">
                <span className="flex justify-between">
                    <span className="uppercase text-[#95979f] text-xs font-semibold tracking-wider">Stake Amount</span>
                    <span className="uppercase text-[#b6a0ff] text-xs font-semibold tracking-wider">Min: {formatNum(dailyStats.min_bet, true)} Max: {formatNum(dailyStats.max_bet, true)}</span>
                </span>
                <input type="number" id="stake" onChange={handleChange} value={stakeValue} className="h-15 w-full rounded-3xl tracking-wide flex items-center outline-0 px-5 mt-4 text-xl text-white font-semibold border border-white/10 placeholder:text-sm" placeholder="Enter amount..." />
                {hasError && (
                    <span className="text-sm tracking-wide text-red-400">Invalid input</span>
                )}

                <div className="w-full flex justify-between">
                    <StakeButton 
                    onClick={() => setStakeValue((prev) => {
                        const numericValue = Number(prev)
                        return String(numericValue * 0.3 >= dailyStats.min_bet ? Math.floor(numericValue * 0.3) : dailyStats.min_bet)
                    })} 
                    label="1/3" />
                    <StakeButton 
                    onClick={() => setStakeValue((prev) => {
                        const numericValue = Number(prev)
                        return String(numericValue * 2 <= dailyStats.max_bet ? Math.floor(numericValue * 2) : dailyStats.max_bet)
                    })} 
                    label="x2" />
                    <StakeButton onClick={() => setStakeValue(String(dailyStats.max_bet > user.coins ? user.coins : dailyStats.max_bet))} label="Max" />
                </div>
            </div> 
            <button className="w-full h-15 rounded-full bg-gradient-purple drop-shadow-[0_0_10px_rgba(126,81,255,0.3)] duration-150 active:scale-98 uppercase text-[#280072] font-semibold text-xl tracking-wider disabled:opacity-40 disabled:active:scale-100" onClick={handleSubmit} disabled={isSpinning}>
                spin
            </button>
        </div>
    )
}