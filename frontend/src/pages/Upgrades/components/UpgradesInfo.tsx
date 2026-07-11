import colors from "../../../utils/colors"
import { useGame } from "../../../context/GameContext"
import { formatNum } from "../../../utils/formatNum"
import { getRankName } from "../../../utils/ranks"

interface SubContainerArgs {
    text: string
    content: string
    color: string
}

const SubContainer = (data: SubContainerArgs) => {
    return (
        <div className="w-7/16 h-full flex flex-col">
            <span className="font-medium text-xs tracking-widest" style={{ color: colors.textGray }}>{data.text}</span>
            <span className="font-bold text-md" style={{ color: data.color }}>{data.content}</span>
        </div>
    )
}

export default function UpgradesInfo() {
    const { user } = useGame()

    if (!user) return

    return (
        <div className="w-full h-2/8 rounded-4xl p-6 drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] flex flex-col font-jakarta min-h-50" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
            <span className="font-medium text-md tracking-widest" style={{ color: colors.textGray }}>HOURLY REVENUE</span>
            <span className="m-5 ml-0 flex items-center">
                <span className="text-4xl font-bold" style={{ color: colors.textPurple }}>+{formatNum(user?.passive_income * 60 * 60, true)}</span>
                <span className="text-lg font-semibold pl-3" style={{ color: colors.primaryBlue }}>/ hr</span>
            </span>

            <div className="w-full h-full flex justify-between">
                <SubContainer text="CLICK INCOME" content={formatNum(user?.click_income)} color={colors.primaryBlue}/>
                <div className="w-0.5 h-full rounded-2xl" style={{ background: "#1d2027" }}/>
                <SubContainer text="RANK" content={getRankName(user?.lvl)} color="#ddc981"/>
            </div>
        </div>
    )
}