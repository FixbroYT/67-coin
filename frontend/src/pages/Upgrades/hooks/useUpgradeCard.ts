import { fetchToState } from "../../../api/dataFetcher"
import { gameApi } from "../../../api/endpoints"

import { Upgrade } from "../../../types/Game"
import { BuyUpgradeData } from "../../../types/Api"
import { styledToast } from "../../../components/styledToast"

import { useGame } from "../../../context/GameContext"
import { useState } from "react"


export function useUpgradeCard(isLocked: boolean, upgrade: Upgrade) {
    const { setUser, setUserUpgrades } = useGame()
    const [ isPending, setIsPending ] = useState(false)

    const setData = (data: BuyUpgradeData) => {
        setUser((prev) => {
            if (!prev) return null

            const updatedUser = {
                ...prev,
                coins: data.coins
            }

            if (data.energy) {
                updatedUser.energy = data.energy.energy,
                updatedUser.energy_restoration = data.energy.energy_restoration,
                updatedUser.max_energy = data.energy.max_energy
            }

            if (upgrade.type == "passive") {
                updatedUser.passive_income = prev.passive_income + data.delta_bonus
            } else if (upgrade.type == "click") {
                updatedUser.click_income = prev.click_income + data.delta_bonus
            }

            return updatedUser
        })
        setUserUpgrades((prev) => {
            if (!prev) return null

            return prev.map((item) => {
                if (item.upgrade_id === upgrade.id) {
                    return {
                        ...item,
                        count: data.upgrade_count,
                        bonus: data.bonus,
                        current_price: data.cost
                    }
                }

                return item
            })
        })
    }

    const handleClick = async() => {
        if (isLocked || isPending) return

        setIsPending(true)
        const success = await fetchToState((() => gameApi.buyUpgrade(upgrade.id)), setData, false)

        if (success) styledToast("success", "The upgrade has been successfully purchased!")
        setIsPending(false)
    }

    return { handleClick, isPending }
}