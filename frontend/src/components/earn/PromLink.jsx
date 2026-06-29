import { Users } from "lucide-react"
import coin from "../../assets/coin.svg"
import { formatNum } from "../../utility/formatNum"
import { useState } from "react"
import { useGame } from "../../context/GameContext"
import { getLeadmagnetBonus } from "../../api/requests"
import { styledToast } from "../styledToast"

export default function PromLink({ name, reward, url, id, isActive }) {
    const [isClicked, setIsClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useGame()

    const handleClick = async () => {
        if (loading) return

        if (isClicked) {
            setLoading(true)
            try {
                const data = await getLeadmagnetBonus(user?.tg_id, id)
                
                if (data === undefined || data === null) {
                    styledToast("error", "You haven't subscribed.")
                    setIsClicked(false) 
                    return
                }

                setUser((prev) => ({ ...prev, ...data }))
                styledToast("success", "Reward successfully received.")
                
            } catch (error) {
                styledToast("error", "Something went wrong.")
            } finally {
                setLoading(false)
            }
            return
        }
        
        setIsClicked(true)
        window.open(url, "_blank")
    }

    return (
        <div className="w-full h-25 bg-[#161a21] rounded-full flex items-center px-5 font-jakarta justify-between">
            <div className="flex">
                <div className="w-15 h-15 flex justify-center items-center rounded-full bg-[#1c2028]">
                    <Users color="#00e3fd" size={30} />
                </div>

                <div className="ml-5 flex flex-col">
                    <span className="text-lg font-semibold tracking-wide text-[#e9eaf3]">{name}</span>
                    <span className="text-[#f8d016] font-bold flex gap-2">
                        +{formatNum(reward)}
                        <img src={coin} alt="coin" className="w-5" />
                    </span>
                </div>
            </div>

            {isActive ? (
                <button 
                    onClick={handleClick} 
                    disabled={loading}
                    className={`w-20 h-13 ${isClicked ? "bg-gradient-blue" : "bg-gradient-purple"} rounded-full text-md tracking-wide text-white font-semibold active:scale-95 duration-150 ease-in-out flex justify-center items-center ${loading ? "opacity-50" : ""}`}
                >
                    {loading ? "..." : (isClicked ? "Check" : "Go")}
                </button>
            ) : (
                <div className="w-20 h-13 rounded-full text-sm tracking-wide text-[#95979f] font-semibold flex justify-center items-center border border-white/5" style={{ background: "rgba(26,29,38,0.6)" }}>
                    Claimed
                </div>
            )}
        </div>
    )
}