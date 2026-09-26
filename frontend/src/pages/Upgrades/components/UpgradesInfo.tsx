import { useGame } from "../../../context/GameContext"
import { formatNum } from "../../../utils/formatNum"
import { getRankName } from "../../../utils/ranks"

interface SubContainerProps {
    text: string
    content: string
    color: string
}

const SubContainer = ({ text, content, color }: SubContainerProps) => {
    return (
        <div className="w-7/16 h-full flex flex-col">
            <span className="font-medium text-xs tracking-widest text-[#95979f]">{text}</span>
            <span className="font-bold text-md" style={{ color: color }}>{content}</span>
        </div>
    )
}

export default function UpgradesInfo() {
    const { user } = useGame()

    if (!user) return

    return (
        <div className="w-full h-2/8 rounded-4xl p-6 drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] flex flex-col font-jakarta min-h-50" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
            <span className="font-medium text-md tracking-widest text-[#95979f]">HOURLY REVENUE</span>
            <span className="m-5 ml-0 flex items-center">
                <span className="text-4xl font-bold text-[#b6a0ff]">+{formatNum(user.passive_income * 60 * 60, true)}</span>
                <span className="text-lg font-semibold pl-3 text-[#00e3fd]">/ hr</span>
            </span>

            <div className="w-full h-full flex justify-between">
                <SubContainer text="CLICK INCOME" content={formatNum(user.click_income)} color={"#00e3fd"}/>
                <div className="w-0.5 h-full rounded-2xl bg-[#1d2027]"/>
                <SubContainer text="RANK" content={getRankName(user.lvl)} color="#ddc981"/>
            </div>
        </div>
    )
}