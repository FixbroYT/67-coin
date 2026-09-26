import { useEffect } from "react"
import { useGame } from "../../../context/GameContext"

import { fetchToState } from "../../../api/dataFetcher"
import { gameApi } from "../../../api/endpoints"

import { styledToast } from "../../../components/styledToast"


const REFRESH_INTERVAL_MS = 30000
let lastTimeRefresh = 0

export function useFriends(inviteUrl: string) {
    const { setReferrals } = useGame()
    
    useEffect(() => {
        const deltaTime = Date.now() - lastTimeRefresh
        const isReadyToRefresh = deltaTime > REFRESH_INTERVAL_MS

        if (isReadyToRefresh) {
            fetchToState(gameApi.getReferrals, setReferrals)
            lastTimeRefresh = Date.now()
        }
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        styledToast("success", "Copied to clipboard.")
    }

    return { handleCopy }
}