import { useGame } from "../context/GameContext"
import UpgradesInfo from "../components/upgrades/UpgradesInfo"
import colors from "../utility/colors"
import UpgradeCard from "../components/upgrades/UpgradeCard"
import Header from "../components/Header"
import { Toaster } from 'react-hot-toast';

export default function Upgrades() {
    const { user, upgrades, setUser } = useGame()

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 content-start">
            <Header />
            <UpgradesInfo />
            <div className="w-full grid gap-5 grid-cols-2 grid-rows-[auto_auto] mt-5 overflow-y-auto custom-scrollbar">
                {upgrades && upgrades.map((upgrade) => {
                    return (
                        <UpgradeCard key={`upgrade_${upgrade.id}`} upgrade={upgrade} user_upgrade={user?.upgrades.filter((e) => e.id == upgrade.id)[0]} user={user} setUser={setUser}/> 
                    )
                })}
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}