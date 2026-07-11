import AccountInfo from "../components/Profile/AccountInfo"
import { useGame } from "../../context/GameContext";
import colors from "../../utils/colors"
import AccountStats from "../components/Profile/AccountStats";

export default function Profile() {
    const { user } = useGame()

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 overflow-y-auto custom-scrollbar">
            <AccountInfo />
            <span className="text-white font-jakarta text-xl font-medium my-5 tracking-wide flex items-end justify-between">
                Player Stats
                <span className="text-sm tracking-wider" style={{ color: colors.textGray }}>All time</span>
            </span>

            <AccountStats />
        </div>
    )
}