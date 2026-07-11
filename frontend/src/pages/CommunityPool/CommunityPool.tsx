import FortuneWheel from "../components/CommunityPool/FortuneWheel"
import Header from "../widgets/Header"

export default function CommunityPool() {
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta">
            <Header />
            
            <FortuneWheel />
        </div>
    )
}