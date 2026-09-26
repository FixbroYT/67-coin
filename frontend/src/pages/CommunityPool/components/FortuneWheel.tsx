import { useState, useRef, useEffect } from "react"


export default function FortuneWheel() {
    const [ isSpining, setIsSpining ] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    const handleClick = () => {
        if (isSpining) return

        setIsSpining(true)

        timerRef.current = setTimeout(() => {
            setIsSpining(false)
        }, 5000)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        <div className="w-full h-fit flex justify-center">
            <button onClick={handleClick} className={`w-[90vw] h-[90vw] bg-[#14161e] max-w-100 max-h-100 rounded-full p-3 drop-shadow-[0_0_40px_rgba(126,81,255,0.15)] ${isSpining && "animate-spin"}`}>
                <div className="border-[#b6a0ff] border-3 w-full h-full rounded-full flex justify-center items-center flex-col gap-1">
                    <span className="text-white font-jakarta font-semibold tracking-wide">I didn't have enough time to finish it :(</span>
                    <span className="text-[#95979f] font-jakarta font-semibold text-sm">But it can spin!</span>
                </div>
            </button>
        </div>
    )
} 