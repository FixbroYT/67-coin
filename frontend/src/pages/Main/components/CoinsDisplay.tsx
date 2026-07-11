import coin from "../../../assets/coin.svg"
import { useGame } from '../../../context/GameContext'
import { formatNum } from "../../../utils/formatNum"

import colors from "../../../utils/colors"

export default function CoinsDisplay() {
    const { user, locations } = useGame()
    let balance = formatNum(user?.coins)

    return (
        <div className="flex justify-center items-center flex-col h-[14vh]">
            <span className="text-5xl font-jakarta font-bold drop-shadow-[0_0_15px_rgba(248,208,22,0.6)] flex items-center" style={{ color: "#f8d016" }}>
                <img src={coin} alt="coin" className="mr-2 w-9 h-9" />
                {balance}
            </span>
            <div className="flex gap-3 mt-3">
                <div className="p-1 rounded-2xl px-2 font-jakarta text-md flex justify-center items-center" style={{ background: colors.cardGray, width: "40vw" }}>
                    <span>
                        <span className="mr-2" style={{ color: colors.textGray }}>Rank</span>
                        <span style={{ color: colors.primaryBlue }}>#{user?.rank}</span>
                    </span>
                </div>
                <div className="p-1 rounded-2xl px-2 font-jakarta text-md flex justify-center items-center" style={{ background: colors.cardGray, width: "40vw" }}>
                    <span>
                        <span className="mr-2" style={{ color: colors.textGray }}>Multiplier</span>
                        <span style={{ color: colors.textPurple }}>x {locations && locations[user?.curr_loc_id - 1]?.multiplier.toFixed(1)}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}