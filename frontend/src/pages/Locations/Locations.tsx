import Header from "../../components/Header"
import LoadingScreen from "../../components/LoadingScreen"
import LocationCard from "./components/LocationCard"

import { useGame } from "../../context/GameContext"
import { useEffect } from "react"

import { gameApi } from "../../api/endpoints"
import { fetchToState } from "../../api/dataFetcher"


export default function Locations() {
    const { user, locations, setLocations, userLocations, setUserLocations } = useGame()
    
    useEffect(() => {
        if (locations || userLocations) return

        fetchToState(gameApi.getLocations, setLocations)
        fetchToState(gameApi.getUserLocations, setUserLocations)
    }, [])

    if (!user || !locations || !userLocations) return <LoadingScreen/>
    
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5 font-jakarta">
            <Header />
            <span className="text-[#eaebf4] text-4xl font-semibold mb-3 drop-shadow-[0_0_5px_rgba(234,235,244,0.3)]">Mining Sites</span>
            <span className="tracking-wide text-[#95979f]">Unlock high-yield locations to amplify your coin generation.</span>
            <div className="flex-col flex h-full mt-10 gap-8 overflow-y-auto custom-scrollbar">
                {locations.map((location) => {
                    return (
                        <LocationCard location={location} isOwned={userLocations.some(el => el.location_id == location.id)} key={`location-${location.id}`}/>
                    )
                })}
            </div>
        </div>
    )
}