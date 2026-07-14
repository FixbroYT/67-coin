import Header from "../../components/Header";
import colors from "../../utils/colors";
import LocationCard from "../components/Locations/LocationCard";
import { useGame } from "../../context/GameContext";


export default function Locations() {
    const { user, locations } = useGame()
    
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta">
            <Header />
            <span className="text-[#eaebf4] text-4xl font-semibold mb-3 drop-shadow-[0_0_5px_rgba(234,235,244,0.3)]">Mining Sites</span>
            <span className="tracking-wide" style={{ color: colors.textGray }}>Unlock high-yield locations to amplify your coin generation.</span>
            <div className="flex-col flex h-full mt-10 gap-8 overflow-y-auto custom-scrollbar">
                {locations.map((location) => {
                    return (
                        <LocationCard location={location} isOwned={user?.loc_ids?.includes(location.id)} currLoc={user?.curr_loc_id} key={`location-${location.id}`}/>
                    )
                })}
            </div>
        </div>
    )
}