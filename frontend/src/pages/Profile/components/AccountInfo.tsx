import coin from "../../assets/coin.svg"
import { useGame } from "../../context/GameContext"
import { useTelegram } from "../../hooks/useTelegram"
import { formatNum } from "../../utils/formatNum"
import { getRankName } from "../../utils/ranks"

export default function AccountInfo() {
    const { user } = useGame()
    const WebApp = useTelegram()

    return (
        <div className="w-full h-80 rounded-4xl drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] font-jakarta flex flex-col items-center justify-center py-4" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
            <div className="rounded-full w-[30vw] h-[30vw] flex justify-center items-center relative" style={{ background: "linear-gradient(132deg,rgba(0, 227, 253, 1) 0%, rgba(87, 126, 254, 1) 50%, rgba(0, 227, 253, 1) 100%)" }}>
                <img src={WebApp?.initDataUnsafe?.user.photo_url} alt="Pfp" className="w-15/16 h-15/16 rounded-full bg-[#151721]" />
            </div>
            <span className="text-white text-3xl mt-5 font-semibold">{WebApp?.initDataUnsafe?.user.username}</span>
            <span className="text-[#00e3fd] text-lg font-semibold">{getRankName(user?.lvl)} #{user?.rank}</span>

            <span className="flex text-xl mt-4 text-white font-bold drop-shadow-[0_0_15px_rgba(248,208,22,0.6)] " style={{ color: "#f8d016" }}>
                <img src={coin} alt="coin" className="mr-2" />
                {formatNum(user?.coins)}
            </span>
        </div>
    )
}