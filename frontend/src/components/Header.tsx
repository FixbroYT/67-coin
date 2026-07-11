import { useGame } from "../context/GameContext"
import coin from "../assets/coin.svg"
import { formatNum } from "../utils/formatNum"

export default function Header() {
    const { user } = useGame()

    return (
        <div className="w-full h-1/15 rounded-2xl mb-5 flex items-center min-h-12 justify-between p-4" style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
                <span className="text-xl font-jakarta font-bold drop-shadow-[0_0_10px_rgba(248,208,22,0.3)] flex items-center" style={{ color: "#f8d016" }}>
                    <img src={coin} alt="coin" className="mr-2 w-6 h-6" />
                    {formatNum(user?.coins)}
                </span>
            <span className="text-xl font-jakarta font-bold drop-shadow-[0_0_10px_rgba(0,227,253,0.3)] flex items-center" style={{ color: "#00e3fd" }}>{user?.lvl} LVL</span>
        </div>
    )
}