import { useGame } from "../../context/GameContext"
import { useClicker } from "../../hooks/useClicker"

export default function MainButton() {
    const { user, setUser } = useGame()
    const { handleClick, popups } = useClicker(user?.tg_id, setUser, user?.click_income)

    return (
        <button onClick={handleClick} disabled={user.energy < 1} className="disabled:opacity-30 rounded-full flex items-center shadow-2xl justify-center active:opacity-80 active:scale-99 transition-all ease-in-out duration-300 max-w-100 max-h-100 drop-shadow-[0_0_100px_rgba(126,81,255,0.5)] select-none" style={{ width: '70vw', height: '70vw' }}>
            <div className="rounded-full w-full h-full flex justify-center items-center" style={{ background: "linear-gradient(300deg,rgba(6, 7, 8, 1) 0%, rgba(23, 26, 33, 1) 100%)" }}>
                <div className="rounded-full w-9/10 h-9/10 border-gradient-purple flex justify-center items-center">
                    <span className="text-9xl font-jakarta font-extrabold" style={{ color: "#d9ecf7" }}>67</span>
                </div>
            </div>
            {popups.map(p => (
                <span key={p.id} className={`fixed animate-float text-2xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(248,208,22,0.6)]`} style={{ top: p.y - window.innerHeight / 3.5, left: p.x - window.innerWidth / 5 }}>
                    +{p.value}
                </span>
            ))}
        </button>
    )
}