import AccountInfo from "./components/AccountInfo"
import AccountStats from "./components/AccountStats"

export default function Profile() {
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 overflow-y-auto custom-scrollbar">
            <AccountInfo />
            <span className="text-white font-jakarta text-xl font-medium my-5 tracking-wide flex items-end justify-between">
                Player Stats
                <span className="text-sm tracking-wider text-[#95979f]">All time</span>
            </span>

            <AccountStats />
        </div>
    )
}