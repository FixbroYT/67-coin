import { createContext, useContext, useState } from "react";

const GameContext = createContext(null)

export function GameProvider({ children }) {
    const [ user, setUser ] = useState(null)
    const [ upgrades, setUpgrades ] = useState(null)
    const [ locations, setLocations ] = useState(null)
    const [ quests, setQuests ] = useState(null)
    const [ referrals, setReferrals ] = useState(null)
    const [ leadmagnets, setLeadmagnets ] = useState(null)

    return (
        <GameContext.Provider value={{
            user, setUser,
            upgrades, setUpgrades,
            locations, setLocations,
            quests, setQuests,
            referrals, setReferrals,
            leadmagnets, setLeadmagnets
        }}>
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    return useContext(GameContext)
}