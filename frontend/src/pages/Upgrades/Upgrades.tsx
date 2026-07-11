import { useGame } from "../../context/GameContext"
import UpgradesInfo from "./components/UpgradesInfo"
import UpgradeCard from "./components/UpgradeCard"
import Header from "../../components/Header"
import { Toaster } from 'react-hot-toast'
import { Upgrade } from "../../types/Game"


export default function Upgrades() {
    const { user, upgrades, setUser, userUpgrades } = useGame()

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 content-start">
            <Header />
            <UpgradesInfo />
            <div className="w-full grid gap-5 grid-cols-2 grid-rows-[auto_auto] mt-5 overflow-y-auto custom-scrollbar">
                {upgrades && upgrades.map((upgrade: Upgrade) => {
                    return (
                        <UpgradeCard key={`upgrade_${upgrade.id}`} upgrade={upgrade} userUpgrade={userUpgrades?.filter((e) => e.upgrade_id == upgrade.id)[0]} user={user} setUser={setUser}/> 
                    )
                })}
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}