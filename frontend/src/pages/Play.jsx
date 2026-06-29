import PlayJackpot from "../components/play/PlayJackpot"
import Game from "../components/play/Game"
import slots from "../assets/Slots.png"

export default function Play() {
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta shrink-0">
            <PlayJackpot />
            <span className="py-4 text-xl text-white font-bold">Quick games</span>

            <nav>
                <Game 
                    img={slots} 
                    color="#00e3fd"
                    name={"Slots"} 
                    desc={"Spin the reels in our new Slots mini-game, match symbols, and multiply your coins instantly!"} 
                    secColor="#04636e"
                    link="slots"
                />
            </nav>
        </div>
    )
}