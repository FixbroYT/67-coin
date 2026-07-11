import { createContext, useContext, useState } from "react"
import { User, Upgrade, UserUpgrade, Location, UserLocation, Quest, UserQuest, Referral, LeadMagnet, ClaimedLeadMagnet, GameContextType, Nullable, GameProvideProps } from "../types/Game"

const GameContext = createContext<GameContextType | undefined>(undefined) 

export function GameProvider({ children }: GameProvideProps) {
    const [ user, setUser ] = useState<Nullable<User>>(null)
    const [ upgrades, setUpgrades ] = useState<Nullable<Upgrade[]>>(null)
    const [ userUpgrades, setUserUpgrades ] = useState<Nullable<UserUpgrade[]>>(null)
    const [ locations, setLocations ] = useState<Nullable<Location[]>>(null)
    const [ userLocations, setUserLocations ] = useState<Nullable<UserLocation[]>>(null)
    const [ quests, setQuests ] = useState<Nullable<Quest[]>>(null)
    const [ userQuests, setUserQuests ] = useState<Nullable<UserQuest[]>>(null)
    const [ referrals, setReferrals ] = useState<Nullable<Referral[]>>(null)
    const [ leadmagnets, setLeadmagnets ] = useState<Nullable<LeadMagnet[]>>(null)
    const [ claimedLeadmagnets, setClaimedLeadmagnets ] = useState<Nullable<ClaimedLeadMagnet[]>>(null)

    return (
        <GameContext.Provider value={{
            user, setUser,
            upgrades, setUpgrades,
            userUpgrades, setUserUpgrades,
            locations, setLocations,
            userLocations, setUserLocations,
            quests, setQuests,
            userQuests, setUserQuests,
            referrals, setReferrals,
            leadmagnets, setLeadmagnets,
            claimedLeadmagnets, setClaimedLeadmagnets
        }}>
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider")
    }

    return context
}