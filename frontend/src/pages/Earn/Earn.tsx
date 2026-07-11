import coin from "../assets/coin.svg"
import PromLink from "./PromLink"
import { useGame } from "../../context/GameContext"
import { Toaster } from "react-hot-toast"
import { formatNum } from "../../utils/formatNum"

export default function Earn() {
    const { leadmagnets, user } = useGame()
    const claimedLeadmagnets = leadmagnets?.filter(((leadmagnet, i) => {
        const id = i + 1
        if (user?.follow_ids.includes(id)) {
            return leadmagnet
        } 
    }))
    const totalEarned = claimedLeadmagnets.reduce((acc, leadmagnet) => acc + (leadmagnet.reward || 0), 0)

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta shrink-0">
            <div className="w-full rounded-4xl p-6 drop-shadow-[0_0_10px_rgba(126,81,255,0.05)] flex flex-col font-jakarta" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
                <span className="text-[#95979f] text-sm uppercase tracking-wider font-medium">
                    total rewards earned
                </span>
                <span className="text-4xl font-jakarta font-bold drop-shadow-[0_0_15px_rgba(248,208,22,0.6)] flex items-center text-[#f8d016] py-3">
                    <img src={coin} alt="coin" className="mr-3 w-7" />
                    {formatNum(totalEarned)}
                </span>
            </div>

            <span className="text-[#ecedf6] text-2xl py-7 font-medium tracking-wide">Available Tasks</span>
            
            <div className="w-full h-full shrink-0 overflow-y-auto gap-5 flex flex-col">
                {leadmagnets.map((leadmagnet, i) => {
                    const id = i + 1
                    return (
                        <PromLink name={leadmagnet.name} reward={leadmagnet.reward} url={leadmagnet.url} id={id} key={`leadmagnet-${id}`} isActive={!user?.follow_ids.includes(id)} />
                    )
                })}
            </div>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}