import { useGame } from "../../../context/GameContext"

import { Referral } from "../../../types/Game"
import { RefBonusData } from "../../../types/Api"

import { fetchToState } from "../../../api/dataFetcher"
import { gameApi } from "../../../api/endpoints"

import { styledToast } from "../../../components/styledToast"


export function useFriendCard(referral: Referral) {
    const { user, setUser, setReferrals } = useGame()

    const setData = (data: RefBonusData) => {
        setUser((prev) => {
            if (!prev) return null

            return {
                ...prev, 
                coins: data.coins
            }
        })

        setReferrals((prev) => {
            if (!prev) return null

            return prev.map((ref) => {
                if (ref.tg_id == referral.tg_id) {
                    return { ...ref, pending_ref_bonus: 0, earned_coins: data.earned_coins }
                }
                return ref
            })
        })
    }
    

    const handleClick = async () => {
        if (!user) return null

        const prevCoins = user.coins
        const success = await fetchToState((() => gameApi.getRefBonus(referral.tg_id)), setData, false)

        if (success) styledToast("success", `You gained ${user.coins - prevCoins} coins!`)
    }

    return { handleClick }
}