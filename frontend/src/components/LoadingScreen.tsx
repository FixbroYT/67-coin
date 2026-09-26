import { useEffect, useState } from "react"

import { LoaderCircle } from "lucide-react"

const PulsingDot = ({ delay }: { delay: number }) => {
    return <span className={`text-2xl text-white font-semibold font-jakarta mt-3 animate-pulse [animation-delay:${delay}ms]`}>.</span>
}

export default function LoadingScreen() {
    const [ startLoading, setStartLoading ] = useState(false)

    useEffect(() => {
        const timerId = setTimeout(() => setStartLoading(true), 500)
        
        return () => clearTimeout(timerId)
    }, [])

    return (
        <div className={`flex justify-center items-center flex-col h-screen transition-opacity duration-300 ease-in-out ${startLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <LoaderCircle color="#fff" className="animate-spin [animation-duration:1.5s] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] w-[40vw] h-[40vw]"/>
            <span className="flex">
                <span className="text-2xl text-white font-semibold font-jakarta mt-3">Loading</span>
                <PulsingDot delay={0} />
                <PulsingDot delay={200} />
                <PulsingDot delay={400} />
            </span>
        </div>
    )
}