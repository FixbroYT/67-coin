import { UserRound } from "lucide-react"
import coin from "../../assets/coin.svg"
import colors from "../../utility/colors"
import { getRankName } from "../../utility/ranks"
import { formatNum } from "../../utility/formatNum"
import { claimPendingRefBonus } from "../../api/requests"
import { useGame } from "../../context/GameContext"
import { styledToast } from "../styledToast"

export default function FriendCard({ referral, id }) {
    const { user, setUser, setReferrals, referrals } = useGame()
    const referralLvl = Math.floor(referral?.xp / 1000)

    const handleClick = async () => {
        const prevCoins = user?.coins || 0
        const data = await claimPendingRefBonus(user?.tg_id, referral?.tg_id)
        
        if (!data) {
            styledToast("error", "Something went wrong.")
            return
        }

        setUser((prev) => ({ 
            ...prev, 
            coins: data.coins
        }))

        setReferrals((prev) => 
            prev.map((r) => {
                if (r.username === referral?.username) {
                    return { ...r, pending_ref_bonus: 0, earned_coins: data.earned_coins }
                }
                return r
            }) 
        )
        
        styledToast("success", `You gained ${data.coins - prevCoins} coins!`)
    }

    return (
        <div className="w-full bg-[#161a21] rounded-4xl p-5 shadow-xl">
            <div className="flex justify-between items-center">
                <div className="flex">
                    <div className="p-2 rounded-full bg-[#10131a] w-fit">
                        <UserRound size={40} color="#b6a0ff" />
                    </div>
                    <div className="ml-4 flex flex-col text-sm">
                        <span className="text-lg font-medium text-white">{referral?.username}</span>
                        <span className="font-medium" style={{ color: colors.textGray }}>
                            Level {referralLvl}
                            <span className="px-2">·</span>
                            {getRankName(referralLvl)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium" style={{ color: colors.textGray }}>TOTAL EARNED</span>
                    <span className="text-2xl text-white font-bold">{formatNum(referral?.earned_coins, true)}</span>
                </div>
            </div>
            <div className='my-3 h-0.5' style={{ background: "#1c2028" }} />
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span className="text-sm text-[#f9d113] font-medium">PENDING BONUS</span>
                    <span className="text-xl text-[#b6a0ff] font-bold">+{formatNum(referral?.pending_ref_bonus, true)}</span>
                </div>

                {referral?.pending_ref_bonus > 0 ? (
                    <button onClick={handleClick} className="w-25 h-12 bg-gradient-purple rounded-full font-semibold text-white text-lg active:scale-95 duration-150 ease-in-out">
                        Claim
                    </button>
                ) : (
                    <div className="w-25 h-12 bg-[#1c2028] rounded-full font-semibold text-[#95979f] text-lg flex justify-center items-center">
                        Claim
                    </div>
                )}
            </div>
        </div>
    )
}