import UpgradesInfo from "./components/UpgradesInfo"
import UpgradeCard from "./components/UpgradeCard"
import Header from "../../components/Header"
import LoadingScreen from "../../components/LoadingScreen"

import { useGame } from "../../context/GameContext"
import { Upgrade } from "../../types/Game"

import { gameApi } from "../../api/endpoints"
import { fetchToState } from "../../api/dataFetcher"

import { useEffect } from "react"

export default function Upgrades() {
    const { upgrades, setUpgrades, userUpgrades, setUserUpgrades } = useGame()

    useEffect(() => {
        if (upgrades || userUpgrades) return

        fetchToState(gameApi.getUpgrades, setUpgrades)
        fetchToState(gameApi.getUserUpgrades, setUserUpgrades)
    }, [])

    if (!upgrades || !userUpgrades) return <LoadingScreen/>

    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 content-start">
            <Header />
            <UpgradesInfo />
            <div className="w-full grid gap-5 grid-cols-2 mt-5 overflow-y-auto custom-scrollbar">
                {upgrades.map((upgrade: Upgrade) => {
                    const userUpgrade = userUpgrades.find((e) => e.upgrade_id === upgrade.id)
                    if (!userUpgrade) return

                    return (
                        <UpgradeCard key={`upgrade_${upgrade.id}`} upgrade={upgrade} userUpgrade={userUpgrade}/> 
                    )
                })}
            </div>
        </div>
    )
}