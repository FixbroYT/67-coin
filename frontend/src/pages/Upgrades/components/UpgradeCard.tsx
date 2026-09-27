import { CircleDollarSign } from "lucide-react"
import { formatNum } from "../../../utils/formatNum"
import { Upgrade, UserUpgrade } from "../../../types/Game"

import DynamicIcon from "../../../components/DynamicIcon"
import { useGame } from "../../../context/GameContext"
import { useUpgradeCard } from "../hooks/useUpgradeCard"


const getColor = (count: number): string[] => {
    if (10 <= count && count < 50) {
        return ["#b6a0ff", "#3d0b97"]
    } else if (count >= 50) {
        return ["#006875", "#cce9ee"]
    }

    return ["#22262f", "#95979f"]
}

interface UpgradeCardProps {
    upgrade: Upgrade
    userUpgrade: UserUpgrade
}

export default function UpgradeCard({ upgrade, userUpgrade }: UpgradeCardProps) {
    const { user } = useGame()

    if (!user) return null

    const isLocked = user.lvl < upgrade.unlock_lvl
    const currentLvl = userUpgrade.count

    const { handleClick, isPending } = useUpgradeCard(isLocked, upgrade)
    const [ lvlBg, lvlText ] = getColor(currentLvl)

    let upgradeBonus = userUpgrade.bonus
    if (upgrade.type === "passive") upgradeBonus *= 3600

    let profitLabel
    switch (upgrade.type) {
        case "click":
            profitLabel = "/click"
            break
        case "passive":
            profitLabel = "/hr"
            break
        case "energy_restoration":
            profitLabel = "En/sec"
            break
        case "max_energy":
            profitLabel = " Energy"
            break
    }

    const upgradeData = {
        Tag: isLocked ? "div" : "button",
        wrapperClass: isLocked
        ? "opacity-30 border-[#22262f]"
        : `active:opacity-30 border-[#017e8c] ${!currentLvl ? "opacity-60" : ""}`,
        bgStyle: isLocked
        ? {}
        : { background: "radial-gradient(circle, rgba(17, 25, 43, 1) 0%, rgba(11, 14, 20, 1) 100%)" },

        iconColor: isLocked
        ? "#95979f"
        : "#00e3fd",

        badgeTxt: isLocked
        ? "LOCKED"
        : `LVL ${currentLvl}`,
        badgeStyle: isLocked
        ? { background: "#22262f", color: "#95979f" }
        : { background: lvlBg, color: lvlText },
        badgeFont: isLocked
        ? "font-light"
        : "font-bold",

        textColor: isLocked
        ? "text-[#95979f]"
        : "text-white",

        profitText: isLocked
        ? "???"
        : `+${formatNum(upgradeBonus, true)}${profitLabel}`,
        profitColor: isLocked ? "text-[#95979f]" : "text-[#f9d113]",

        priceLabel: isLocked
        ? `UNLOCK AT LVL ${upgrade.unlock_lvl}`
        : formatNum(userUpgrade.current_price, true),
        priceLabelClass: isLocked
        ? "text-sm font-medium"
        : "text-lg font-bold"
    }

    const CardTag = upgradeData.Tag as React.ElementType

    return (
        <CardTag onClick={handleClick} disabled={isPending} className={`w-full h-full rounded-4xl border-2 shadow-2xl flex flex-col p-4 font-jakarta transition-all ease-in-out duration-150 ${upgradeData.wrapperClass}`} 
        style={upgradeData.bgStyle}
        > 
            <div className="w-full flex justify-between">
                <DynamicIcon name={upgrade.icon_name} color={upgradeData.iconColor} size={50}/>
                <span className={`text-xs ${upgradeData.badgeFont} p-2 pl-3 pr-3 h-fit rounded-2xl`} style={upgradeData.badgeStyle}>{upgradeData.badgeTxt}</span>
            </div>
            <span className={`text-lg font-semibold ${upgradeData.textColor} mt-1 text-left line-clamp-1`}>{upgrade.name}</span>
            <span className="text-left">
                <span className="text-sm font-medium text-[#95979f]">Profit: </span>
                <span className={`text-xs font-bold pl-2 ${upgradeData.profitColor}`}>{upgradeData.profitText}</span>
            </span>
            <div className="mt-3 h-0.5 bg-[#1a1b29]"/>
            <span className="mt-3 flex items-center">
                {isLocked ? "" : <CircleDollarSign color="#f9d113"/>}
                <span className={`ml-2 ${upgradeData.priceLabelClass} ${upgradeData.textColor}`}>{upgradeData.priceLabel}</span>
            </span>
        </CardTag>
    )
}