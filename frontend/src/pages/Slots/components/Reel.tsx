import { fruits } from "../config"

export default function Reel ({ contentId }: { contentId: number }) {
    const len = fruits.length
    return (
        <div className="h-full w-[28%] rounded-3xl bg-[#1c2028]/40 border border-white/5 shadow-md flex items-center justify-center flex-col gap-5 overflow-hidden py-2 select-none">
            <span className="text-3xl opacity-20 filter blur-[0.5px]">{fruits[(contentId - 1 + len) % len]}</span>
            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{fruits[contentId]}</span>
            <span className="text-3xl opacity-20 filter blur-[0.5px]">{fruits[(contentId + 1) % len]}</span>
        </div>
    )
}
