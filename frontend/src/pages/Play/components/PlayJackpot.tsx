import { Landmark, Info } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { formatNum } from "../../utils/formatNum";
import { NavLink } from "react-router-dom";


export default function PlayJackpot() {
    const { user } = useGame()

    const percentage = user?.daily_deposit / user?.required_daily_deposit * 100 

    return (
        <div className="w-full h-83 rounded-4xl drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] p-5 font-jakarta flex flex-col" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
            <span className="flex items-center justify-between pb-4">
                <div className="p-3 border-white/10 border w-fit h-fit rounded-2xl backdrop-blur-md drop-shadow-[0_0_20px_rgb(126,81,255)]" style={{ background: "rgba(103,62,237,0.15)"}}>
                    <Landmark fill="#b6a0ff" color="#b6a0ff" size={30} />
                </div>
                <span className="text-[#b6a0ff] font-bold italic text-2xl uppercase tracking-wide">Community pool</span>
            </span>
            <span className="text-[#95979f] text-sm tracking-wide font-medium">
                A massive global fund fueled by 10% of every house edge. Your share is calculated daily based on your activity and tier.
            </span>

            <span className="py-3 my-5 text-white uppercase text-xs font-semibold tracking-wider bg-[#1a1d26] px-3 w-fit border border-white/5 rounded-4xl flex items-center gap-2 shadow-xl">
                <Info size={17} color="#b6a0ff" />
                Next Payout: 00:00 UTC
            </span>

            {percentage >= 100 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <NavLink 
                    className="w-full h-12 rounded-full text-lg uppercase tracking-widest font-bold active:scale-95 duration-150 ease-in-out flex justify-center items-center bg-gradient-purple text-[#280072] drop-shadow-[0_0_10px_rgba(126,81,255,0.2)]"
                    to="/community-pool">
                        Go
                    </NavLink>
                </div>
            ) : (
                <div>
                    <span className="text-[#696c72] uppercase font-semibold text-xs tracking-wide">Your progress</span>
                    <div className="py-1 gap-1 flex items-center">  
                        <span className="text-white font-semibold text-lg">{formatNum(user?.daily_deposit)}</span>
                        <span className="text-[#696c72] text-sm font-bold tracking-wide">/ {formatNum(user?.required_daily_deposit)} Wagered</span>
                    </div>

                    <div className="w-full h-4 rounded-full mt-1 flex items-center justify-start overflow-hidden p-1" style={{ background: "#191c29" }}>
                        <div className="h-full rounded-full border-gradient-purple" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    )
}