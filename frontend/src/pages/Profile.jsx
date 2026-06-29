import AccountInfo from "../components/profile/AccountInfo"
import { useGame } from "../context/GameContext";
import colors from "../utility/colors"
import AccountStats from "../components/profile/AccountStats";

export default function Profile() {
    const { user } = useGame()

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5">
            <AccountInfo />
            <span className="text-white font-jakarta text-xl font-medium my-5 tracking-wide flex items-end justify-between">
                Player Stats
                <span className="text-sm tracking-wider" style={{ color: colors.textGray }}>All time</span>
            </span>

            <AccountStats />
        </div>
    )
}