import { useGame } from "../../../context/GameContext"
import { Location } from "../../../types/Game"
import { useLocationCard } from "../hooks/useLocationCard"

import { formatNum } from "../../../utils/formatNum"

import { Zap } from "lucide-react"


const hexToRgba = (hex: string, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface LocationCardProps {
    location: Location,
    isOwned: boolean
}

export default function LocationCard({ location, isOwned }: LocationCardProps) {
    const { user } = useGame()
    if (!user) return null

    const { handleClick, handleClickGoTo } = useLocationCard(location)
    const bgUrl = location.img_url

    return (
        <div className="w-full h-60 bg-cover bg-center relative rounded-4xl shadow-xl p-5 flex flex-col justify-between shrink-0">
              <img 
                src={bgUrl} 
                className="absolute inset-0 w-full h-full object-cover rounded-4xl -z-1" 
                alt="Background" 
            />
            
            <div className="absolute inset-0 -z-1 rounded-4xl" style={{ background: "radial-gradient(circle,rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%)"}}></div>

            <div className="flex justify-between">
                <div className={`inline-flex items-center h-fit px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wide backdrop-blur-md border border-white/10`} style={{ color: hexToRgba(location.color), background: hexToRgba(location.color, 0.2) }}>
                    x{location.bonus_multiplier.toFixed(1)} Profit
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-[#95979f]">LOCATION COST</span>
                    <span className="text-lg font-bold text-[#fee693] mt-1">{location.cost !== 0 ? formatNum(location?.cost, true) : "Free"}</span>
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div className="flex flex-col justify-start">
                    <span className="text-white font-bold text-3xl py-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{location.name}</span>
                    <span className="text-md font-medium flex items-center text-[#00e3fd]">
                        <Zap size={16} className="mr-2" fill={"#00e3fd"}/>
                        {location.desc}
                    </span>
                </div>
                {!isOwned ? (
                    <button onClick={handleClick} className="text-md px-8 py-3 h-fit rounded-full font-bold bg-gradient-purple text-[#280072] active:scale-90 transition-transform ease-in-out duration-150">
                        Buy
                    </button>
                ) : 
                    location.id == user.current_loc_id ? (
                        <div className="text-md px-8 py-3 h-fit rounded-full font-bold backdrop-blur-md border border-white/5 text-[#95979f]" style={{ background: "rgba(26,29,38,0.2)" }}>
                            Here 
                        </div>
                    ) : (
                        <button onClick={handleClickGoTo} className="text-md px-8 py-3 h-fit bg-gradient-blue rounded-full font-bold backdrop-blur-md text-[#ffffff] active:scale-90 transition-transform ease-in-out duration-150">
                            Go
                        </button>
                    )
                }
            </div>
        </div>
        
    )
}