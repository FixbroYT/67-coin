import colors from "../../utility/colors"
import { useGame } from '../../context/GameContext'
import { useState, useEffect } from "react"
import { Zap } from "lucide-react";

export default function Energy() {
    const { user } = useGame()
    const [ energyBar, setEnergyBar ] = useState(user?.energy)

    const percentage = Math.min(((user?.energy || 0) / (user?.max_energy || 1)) * 100, 100);

    return (
        <div className="w-full h-2/5">
            <span className="flex justify-between">
                <span className="flex items-center">
                    <Zap fill="#00e3fd" color="#00e3fd" size={20} />
                    <span className="text-xl font-jakarta font-medium pr-2 pl-2" style={{ color: "#e1dff2" }}>{user?.energy}</span>
                    <span className="text-xl font-jakarta font-medium pr-2" style={{ color: "#a1a0b2"}}>/</span>
                    <span className="text-xl font-jakarta font-medium" style={{ color: "#a1a0b2"}}>{user?.max_energy}</span>
                </span>
            </span>
            <div className="w-full h-1/3 rounded-full mt-3 flex items-center justify-start overflow-hidden p-1" style={{ background: "#191c29" }}>
                <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,rgba(0, 227, 253, 1) 0%, rgba(182, 160, 255, 1) 100%)", width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}