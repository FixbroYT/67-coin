import { useGame } from "../../context/GameContext";
import colors from "../../utils/colors";
import { Zap, Copy } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { formatNum } from "../../utils/formatNum";
import coin from "../assets/coin.svg"
import { useEffect, useCallback, useState } from "react";
import { getData } from "../../api/client";
import FriendCard from "../components/Friends/FriendCard";
import LoadingScreen from "../../components/LoadingScreen";
import { styledToast } from "../components/styledToast";
import FriendsInfo from "../components/Friends/FriendsInfo";


function Card({ children }) {
    return (
        <div className="bg-[#1c2028] w-9/20 h-25 rounded-4xl p-4 px-5 flex flex-col">
            {children}
        </div>
    )
}


function MiniInfo({ label, children }) {
    return (
        <div className="bg-[#161a21] rounded-3xl p-4 flex flex-col shadow-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.textGray }}>{label}</span>
            <span className="text-2xl text-white font-black mt-1">{children}</span>
        </div>
    )
}


export default function Friends() {
    const { user, setReferrals, referrals } = useGame()
    const inviteUrl = `https://t.me/sixseven_coin_bot?start=${user?.tg_id}`
    const [ i, setI ] = useState(30)

    const fetchData = useCallback(async () => {
        if (!user?.tg_id) return
        try {
            const data = await getData(`referrals/${user?.tg_id}/get-all`)
            if (data) setReferrals(data)
        } catch (e) {
            console.error(e)
        }
    }, [user?.tg_id, setReferrals])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setI((prev) => {
                if (prev >= 29) {
                    fetchData()
                    return 0
                }
                return prev + 1
            });
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [fetchData])

    const totalEarned = referrals?.reduce((acc, ref) => acc + (ref.earned_coins || 0), 0)

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        styledToast("success", "Copied to clipboard.")
    }

    if (!referrals) return <LoadingScreen />;

    return (
        <div className="flex flex-col w-full h-full p-5 font-jakarta overflow-y-auto pb-24">
            <FriendsInfo />

            <span className="text-[10px] tracking-[0.2em] font-black py-4 uppercase" style={{ color: colors.textGray }}>
                Invite Link
            </span>

            <div className="w-full min-h-14 bg-[#10131a] rounded-full px-5 py-2 flex items-center justify-between border border-white/5">
                <span className="font-medium truncate text-sm flex-1 mr-2" style={{ color: colors.textGray }}>
                    {inviteUrl}
                </span>
                <button onClick={handleCopy} 
                        className="w-10 h-10 shrink-0 bg-[#1c2028] rounded-full flex items-center justify-center active:scale-90 transition-transform duration-150">
                    <Copy color="#b6a0ff" size={18} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
                <MiniInfo label="Total Invited">{referrals?.length || 0}</ MiniInfo>
                <MiniInfo label="Total Earned">
                    <span className="flex items-center">
                        <img src={coin} alt="coin" className="w-5 h-5 mr-2" />
                        {formatNum(totalEarned, true)}
                    </span>
                </ MiniInfo>
            </div>

            <span className="text-xl text-white font-bold mb-4">Your Friends</span>
            
            <div className="flex flex-col gap-5">
                {referrals.length !== 0 ? (
                    referrals.map((ref, idx) => (
                        <FriendCard key={idx} referral={ref} id={idx} />
                    ))
                ) : (
                    <div className="w-full py-10 flex justify-center items-center">
                        <span className="text-sm italic" style={{ color: colors.textGray }}>
                            You don't have any friends yet.
                        </span>
                    </div>
                )}
            </div>

            <Toaster position="top-center" reverseOrder={false} />
        </div>

    )
}