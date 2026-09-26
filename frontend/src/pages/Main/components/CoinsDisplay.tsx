import coin from "../../../assets/coin.svg"
import { useGame } from '../../../context/GameContext'
import { formatNum } from "../../../utils/formatNum"

export default function CoinsDisplay() {
    const { user } = useGame()
    if (!user) return null

    const balance = formatNum(user.coins)

    return (
        <div className="flex justify-center items-center flex-col h-[14vh]">
            <span className="text-5xl font-jakarta font-bold drop-shadow-[0_0_15px_rgba(248,208,22,0.6)] flex items-center text-[#f8d016]">
                <img src={coin} alt="coin" className="mr-2 w-9 h-9" />
                {balance}
            </span>
            <div className="flex gap-3 mt-3">
                <div className="p-1 rounded-2xl px-2 font-jakarta text-md flex justify-center items-center w-[40vw] bg-[#1c2028]">
                    <span>
                        <span className="mr-2 text-[#95979f]">Rank</span>
                        <span className="text-[#00e3fd]">#{user?.rank}</span>
                    </span>
                </div>
                <div className="p-1 rounded-2xl px-2 font-jakarta text-md flex justify-center items-center w-[40vw] bg-[#1c2028]">
                    <span>
                        <span className="text-[#00e3fd] flex items-center">
                            + {formatNum(user?.passive_income * 3600, true)}
                            <span className="ml-2 text-[#95979f] font-semibold"> / hr</span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}