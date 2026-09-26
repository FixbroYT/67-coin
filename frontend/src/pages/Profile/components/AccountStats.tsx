import { useGame } from "../../../context/GameContext"
import { TrendingUp } from "lucide-react"
import { formatNum } from "../../../utils/formatNum"


export default function AccountStats() {
    const { user } = useGame()
    if (!user) return null

    const percentage = Math.min((((user.xp - user.lvl * 1000) || 0) / 1000) * 100, 100)

    return (
        <div>
            <div className="flex justify-between">
                <div className="w-[42vw] h-35 rounded-4xl bg-[#161a21] shadow-xs p-5 flex flex-col font-jakarta"> 
                    <span className="font-semibold tracking-wider text-sm text-[#95979f]">TOTAL TAPS</span>
                    <span className="text-2xl text-white font-semibold py-3">{formatNum(user.total_taps)}</span>
                    <span className="flex text-[#b6a0ff]">
                        <TrendingUp color={"#b6a0ff"} className="mr-3" />
                        4.2%
                    </span>
                </div>

                <div className="w-[42vw] h-35 rounded-4xl bg-[#161a21] shadow-xs p-5 flex flex-col font-jakarta"> 
                    <span className="font-semibold tracking-wider text-sm text-[#95979f]">INCOME</span>
                    <span className="text-xl text-[#b6a0ff] font-semibold py-3 flex items-center">
                        + {formatNum(user.passive_income * 3600, true)}
                        <span className="text-sm ml-3 text-[#00e3fd]"> / hr</span>
                    </span> 
                    <span className="text-xl text-[#b6a0ff] font-semibold flex items-center">
                        + {formatNum(user.click_income, true)}
                        <span className="text-sm ml-3 text-[#00e3fd]"> / click</span>
                    </span> 
                </div>
            </div>

            <div className="w-full h-25 mt-5 bg-[#161a21] rounded-4xl p-5">
                <span className="flex justify-between text-white font-jakarta tracking-wide">
                    <span>LVL {user.lvl}</span>
                    <span>LVL {user.lvl + 1}</span>
                </span>

                <div className="w-full h-1/3 rounded-full mt-3 flex items-center justify-start overflow-hidden p-1 bg-[#191c29]">
                    <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,rgba(0, 227, 253, 1) 0%, rgba(182, 160, 255, 1) 100%)", width: `${percentage}%` }}/>
                </div>
            </div>

        </div>
    )
}