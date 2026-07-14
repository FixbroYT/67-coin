import UpgradesInfo from "./components/UpgradesInfo"
import UpgradeCard from "./components/UpgradeCard"
import Header from "../../components/Header"

import { useGame } from "../../context/GameContext"
import { Upgrade } from "../../types/Game"

import { gameApi } from "../../api/endpoints"
import { fetchToState } from "../../api/dataFetcher"

import { useEffect } from "react"

export default function Upgrades() {
    const { user, setUser, upgrades, setUpgrades, userUpgrades, setUserUpgrades } = useGame()

    useEffect(() => {
        fetchToState(gameApi.getUpgrades, setUpgrades)
        fetchToState(gameApi.getUserUpgrades, setUserUpgrades)
    }, [])

    if (!upgrades || !userUpgrades) return null

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 content-start">
            <Header />
            <UpgradesInfo />
            <div className="w-full grid gap-5 grid-cols-2 grid-rows-[auto_auto] mt-5 overflow-y-auto custom-scrollbar">
                {upgrades.map((upgrade: Upgrade) => {
                    const userUpgrade = userUpgrades.find((e) => e.upgrade_id === upgrade.id)
                    if (!userUpgrade) return

                    return (
                        <UpgradeCard key={`upgrade_${upgrade.id}`} upgrade={upgrade} userUpgrade={userUpgrade} user={user} setUser={setUser}/> 
                    )
                })}
            </div>
        </div>
    )
}