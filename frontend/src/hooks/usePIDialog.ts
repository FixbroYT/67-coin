import { useEffect, useRef, useState } from "react"
import { useGame } from "../context/GameContext"

import { fetchToState } from "../api/dataFetcher"
import { gameApi } from "../api/endpoints"

import { Nullable } from "../types/Game"
import { PassiveIncomeData } from "../types/Api"


export function usePIDialog() {
    const [ passiveIncomeData, setPassiveIncomeData ] = useState<Nullable<PassiveIncomeData>>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { setUser } = useGame()

    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            const data = await fetchToState(gameApi.claimPendingPassiveIncome, setPassiveIncomeData)

            if (!isMounted || !dialogRef.current || !data || data.claimed_coins <= 0) return

            setUser((prev) => {
                if (!prev) return null

                return {
                    ...prev, coins: data.coins
                }
            })

            dialogRef.current.showModal()
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [])

    return { dialogRef, passiveIncomeData }
}