import { useGame } from "../../context/GameContext"
import { useEffect } from "react"

import { fetchToState } from "../../api/dataFetcher"
import { gameApi } from "../../api/endpoints"

import { formatNum } from "../../utils/formatNum"

import PromLink from "./components/PromLink"
import LoadingScreen from "../../components/LoadingScreen"

import coin from "../../assets/coin.svg"


export default function Earn() {
    const { user, leadmagnets, setLeadmagnets, claimedLeadmagnets, setClaimedLeadmagnets } = useGame()
 
    useEffect(() => {
        if (leadmagnets || claimedLeadmagnets) return

        fetchToState(gameApi.getLeadmagnets, setLeadmagnets)
        fetchToState(gameApi.getClaimedLeadmagnets, setClaimedLeadmagnets)
    }, [])

    if (!user || !leadmagnets || !claimedLeadmagnets) return <LoadingScreen/>

    const totalEarned = leadmagnets.reduce((acc, leadmagnet) => {
        if (claimedLeadmagnets.some(el => el.leadmagnet_id == leadmagnet.id)) {
            return acc + leadmagnet.reward
        }
        return acc
    }, 0)

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
                {leadmagnets.map((leadmagnet) => {
                    return (
                        <PromLink leadmagnet={leadmagnet} key={`leadmagnet-${leadmagnet.id}`} isActive={!claimedLeadmagnets.some(el => el.leadmagnet_id == leadmagnet.id)} />
                    )
                })}
            </div>
        </div>
    )
}