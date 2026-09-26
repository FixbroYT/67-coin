//PIDialog - Passive Income Dialog
import coin from "../assets/coin.svg"
import { Wallet } from "lucide-react"

import { formatNum } from "../utils/formatNum"
import { formatTime } from "../utils/formatTime"

import { PassiveIncomeData } from "../types/Api"
import { Nullable } from "../types/Game"

import { useGame } from "../context/GameContext"


interface DialogStatDivProps {
    label: string,
    value: string,
    additional: string
}

interface PIDialogContentProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>,
    passiveIncomeData: Nullable<PassiveIncomeData>
}


const DialogStatDiv = ({ label, value, additional }: DialogStatDivProps) => {
    return (
        <div className="bg-black/15 flex-1 w-30 rounded-xl p-3 shadow-lg">
            <p className="text-[#95979f] uppercase font-semibold text-sm tracking-wider">{label}</p>
            <p className="text-[#00e3fd] font-bold py-2">{value}</p>
            <p className="text-[#95979f] font-semibold tracking-tight text-xs">{additional}</p>
        </div>
    )
}


export default function PIDialogContent({ dialogRef, passiveIncomeData }: PIDialogContentProps) {
    const { user } = useGame()

    if (!passiveIncomeData || !user) return null

    const timeString = formatTime(passiveIncomeData.delta_time)
    const rateString = formatNum(user.passive_income)
    
    return (
        <div className="h-full w-full flex flex-col font-jakarta items-center">
            <span className="py-2 px-5 mb-4 flex items-center gap-4 bg-white/6 rounded-full shadow-2xl">
                <div className="bg-[#00e3fd] h-2.5 w-2.5 rounded-full relative before:absolute before:inset-0 before:bg-[#00e3fd] before:rounded-full before:animate-ping before:content-['']"/>
                <p className="text-[#00e3fd] font-semibold uppercase tracking-wide">offline recovery</p>
            </span>

            <div className="flex flex-col items-center gap-3">
                <p className="text-white font-bold text-2xl tracking-tight">Welcome Back!</p>
                <p className="text-[#95979f] text-center">Since your last visit, your offline earnings have totaled: </p>
                <span className="text-4xl font-jakarta font-bold drop-shadow-[0_0_10px_rgba(248,208,22,0.3)] flex items-end text-[#f8d016] mb-3">
                    <img src={coin} alt="coin" className="mr-2 w-8 h-8" />
                    +{formatNum(passiveIncomeData.claimed_coins)}
                </span>
            </div>

            <div className="flex gap-4 p-2 mt-5">
                <DialogStatDiv label="Duration" value={timeString} additional="Capped at 3h"/>
                <DialogStatDiv label="Rate / hr" value={rateString} additional="Automated"/>
            </div>

            <button onClick={() => dialogRef.current?.close()} className="bg-gradient-purple py-3 my-5 w-full rounded-full outline-0 flex items-center justify-center gap-2 text-[#280072] font-bold text-xl uppercase shadow-lg active:scale-95 duration-150 ease-in-out">
                <Wallet/>
                Continue
            </button>
        </div>
    )
}