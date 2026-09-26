import { useState } from "react"
import { useGame } from "../../../context/GameContext"

import { gameApi } from "../../../api/endpoints"
import { fetchToState } from "../../../api/dataFetcher"

import { styledToast } from "../../../components/styledToast"
import { LeadMagnet } from "../../../types/Game"
import { LeadMagnetBonusData } from "../../../types/Api"


export function usePromLink(leadmagnet: LeadMagnet) {
    const [ isClicked, setIsClicked ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const { setUser, setClaimedLeadmagnets } = useGame()

    const setData = (data: LeadMagnetBonusData) => {
        setUser((prev) => {
            if (!prev) return null

            return { ...prev, coins: data.coins }
        })
        setClaimedLeadmagnets((prev) => {
            if (!prev) return null

            return [ ...prev, { leadmagnet_id: data.leadmagnet_id }]
        })
    } 

    const handleClick = async () => {
        if (loading) return
        
        if (!isClicked) {
            setIsClicked(true)
            window.open(leadmagnet.url, "_blank")
            return
        }

        const success = await fetchToState(() => gameApi.getLeadmagnetBonus(leadmagnet.id), setData)
        if (success) styledToast("success", "Reward successfully received.")
        else styledToast("error", "You haven't subscribed.")

        setLoading(false)
    }

    return { handleClick, loading, isClicked }
}