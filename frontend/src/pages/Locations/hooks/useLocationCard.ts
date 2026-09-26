import { useGame } from "../../../context/GameContext"
import { useState } from "react"

import { Location } from "../../../types/Game"
import { BuyLocationData, SetLocationData } from "../../../types/Api"

import { fetchToState } from "../../../api/dataFetcher"
import { gameApi } from "../../../api/endpoints"

import { styledToast } from "../../../components/styledToast"


export function useLocationCard(location: Location) {
    const { setUser, setUserLocations } = useGame()
    const [ isPending, setIsPending ] = useState(false)

    const setBuyData = (data: BuyLocationData) => {
        setUser((prev) => {
            if (!prev) return null

            return {
                ...prev, coins: data.coins
            }
        })
        setUserLocations((prev) => {
            if (!prev) return null

            return [...prev, { location_id: data.location_id }]
        })
    }

    const setGoData = (data: SetLocationData) => {
        setUser((prev) => {
            if (!prev) return null

            return { 
                ...prev, 
                click_income: data.click_income, 
                current_loc_id: data.current_loc_id 
            }
        })
    }

    const handleClick = async () => {
        if (isPending) return

        setIsPending(true)
        const success = await fetchToState(() => gameApi.buyLocation(location.id), setBuyData, false)

        if (success) styledToast("success", "The location has been successfully purchased!")
        setIsPending(false)
    }

    const handleClickGoTo = async () => {
        await fetchToState(() => gameApi.setLocation(location.id), setGoData, false)
    }

    return { handleClick, handleClickGoTo }
}