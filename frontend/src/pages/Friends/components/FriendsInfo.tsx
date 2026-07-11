import { Zap } from "lucide-react";
import colors from "../../utils/colors";


export default function FriendsInfo() {
    return (
        <div className="w-full rounded-4xl px-6 py-6 drop-shadow-[0_0_20px_rgba(126,81,255,0.1)] flex flex-col items-center shrink-0" 
            style={{ background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)" }}>
            
            <span className="text-2xl sm:text-3xl pb-2 text-[#ecedf6] font-bold tracking-wide text-center">Grow Your Squad</span>
            
            <span className="text-base sm:text-lg px-2 text-center" style={{ color: colors.textGray }}>
                Invite friends to join the 67 ecosystem and earn massive bonuses together.
            </span>

            <div className="w-full sm:w-9/10 min-h-14 my-5 rounded-full border border-white/10 flex items-center justify-center px-4 drop-shadow-[0_0_20px_rgba(29,141,194,0.7)]" 
                style={{ background: "rgba(0,227,253,0.15)", backdropFilter: "blur(10px)" }}>
                <Zap fill="#00e3fd" color="#00e3fd" size={20} />
                <span className="text-white ml-3 font-bold">+10% Per Ref Click</span>
            </div>
        </div>
    )
}