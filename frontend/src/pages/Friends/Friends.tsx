import { useGame } from "../../context/GameContext"
import { useMemo } from "react"
import { useFriends } from "./hooks/useFriends"

import { formatNum } from "../../utils/formatNum"

import FriendsInfo from "./components/FriendsInfo"
import FriendCard from "./components/FriendCard"
import LoadingScreen from "../../components/LoadingScreen"

import coin from "../../assets/coin.svg"
import { Copy } from "lucide-react"


interface MiniInfoProps {
    label: string,
    children: React.ReactNode
}

function MiniInfo({ label, children }: MiniInfoProps) {
    return (
        <div className="bg-[#161a21] rounded-3xl p-4 flex flex-col shadow-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#95979f]">{label}</span>
            <span className="text-2xl text-white font-black mt-1">{children}</span>
        </div>
    )
}

export default function Friends() {
    const { referrals } = useGame()

    const tg_id = (window as any).Telegram?.WebApp?.initDataUnsafe.user.id
    const inviteUrl = `https://t.me/sixseven_coin_bot?start=${tg_id}`
    const { handleCopy } = useFriends(inviteUrl)

    const totalEarned = useMemo(() => {
        if (!referrals) return 0
        return referrals.reduce((acc, ref) => acc + (ref.earned_coins || 0), 0)
    }, [])

    if (!referrals) return <LoadingScreen/>
    return (
        <div className="flex flex-col w-full h-full p-5 font-jakarta overflow-y-auto pb-24">
            <FriendsInfo />

            <span className="text-[10px] tracking-[0.2em] font-black py-4 uppercase text-[#95979f]">
                Invite Link
            </span>

            <div className="w-full min-h-14 bg-[#10131a] rounded-full px-5 py-2 flex items-center justify-between border border-white/5">
                <span className="font-medium truncate text-sm flex-1 mr-2 text-[#95979f]">
                    {inviteUrl}
                </span>
                <button onClick={handleCopy} 
                        className="w-10 h-10 shrink-0 bg-[#1c2028] rounded-full flex items-center justify-center active:scale-90 transition-transform duration-150">
                    <Copy color="#b6a0ff" size={18} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
                <MiniInfo label="Total Invited">{referrals.length || 0}</ MiniInfo>
                <MiniInfo label="Total Earned">
                    <span className="flex items-center">
                        <img src={coin} alt="coin" className="w-5 h-5 mr-2" />
                        {formatNum(totalEarned, true)}
                    </span>
                </MiniInfo>
            </div>

            <span className="text-xl text-white font-bold mb-4">Your Friends</span>
            
            <div className="flex flex-col gap-5">
                {referrals.length !== 0 ? (
                    referrals.map((ref) => (
                        <FriendCard key={ref.username} referral={ref}/>
                    ))
                ) : (
                    <div className="w-full py-10 flex justify-center items-center">
                        <span className="text-sm italic text-[#95979f]">
                            You don't have any friends yet.
                        </span>
                    </div>
                )}
            </div>
        </div>

    )
}