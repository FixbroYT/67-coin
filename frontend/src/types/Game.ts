import { ReactNode, Dispatch, SetStateAction } from "react"
import { z } from "zod"


export type Nullable<T> = T | null
export type SetState<T> = Dispatch<SetStateAction<T>>


export const UserSchema = z.object({
    coins: z.number(),
    xp: z.number(),
    lvl: z.number(),
    current_loc_id: z.number(),
    click_income: z.number(),
    passive_income: z.number(),
    total_taps: z.number(),
    energy: z.number(),
    energy_restoration: z.number(),
    max_energy: z.number(),
    rank: z.number(),
})
export type User = z.infer<typeof UserSchema>


export const UpgradeSchema = z.object({
    id: z.number(),
    name: z.string(),
    unlock_lvl: z.number(),
    type: z.string(),
    icon_name: z.string(),
})
export type Upgrade = z.infer<typeof UpgradeSchema>

export const UserUpgradeSchema = z.object({
    upgrade_id: z.number(),
    count: z.number(),
    bonus: z.number(),
    current_price: z.number(),
})
export type UserUpgrade = z.infer<typeof UserUpgradeSchema>


export const LocationSchema = z.object({
    id: z.number(),
    name: z.string(),
    desc: z.string(),
    cost: z.number(),
    bonus_multiplier: z.number(),
    color: z.string(),
    img_url: z.string(),
})
export type Location = z.infer<typeof LocationSchema>

export const UserLocationSchema = z.object({
    location_id: z.number(),
});
export type UserLocation = z.infer<typeof UserLocationSchema>


export const QuestSchema = z.object({
    id: z.number(),
    name: z.string(),
    desc: z.string(),
})
export type Quest = z.infer<typeof QuestSchema>

export const UserQuestSchema = z.object({
    quest_id: z.number(),
    goal: z.number(),
    reward: z.number(),
    progress: z.number(),
})
export type UserQuest = z.infer<typeof UserQuestSchema>


export const ReferralSchema = z.object({
    username: z.string(),
    xp: z.number(),
    tg_id: z.number(),
    pending_ref_bonus: z.number(),
    earned_coins: z.number(),
})
export type Referral = z.infer<typeof ReferralSchema>


export const LeadMagnetSchema = z.object({
    name: z.string(),
    reward: z.number(),
    url: z.string(),
    icon_name: z.string(),
    color: z.string(),
})
export type LeadMagnet = z.infer<typeof LeadMagnetSchema>

export const ClaimedLeadMagnetSchema = z.object({
    leadmagnet_id: z.number(),
})


export type ClaimedLeadMagnet = z.infer<typeof ClaimedLeadMagnetSchema>

export interface GameContextType {
    user: Nullable<User>
    setUser: SetState<Nullable<User>>
    
    upgrades: Nullable<Upgrade[]>
    setUpgrades: SetState<Nullable<Upgrade[]>>
    
    userUpgrades: Nullable<UserUpgrade[]>
    setUserUpgrades: SetState<Nullable<UserUpgrade[]>>
    
    locations: Nullable<Location[]>
    setLocations: SetState<Nullable<Location[]>>
    
    userLocations: Nullable<UserLocation[]>
    setUserLocations: SetState<Nullable<UserLocation[]>>
    
    quests: Nullable<Quest[]>
    setQuests: SetState<Nullable<Quest[]>>
    
    userQuests: Nullable<UserQuest[]>
    setUserQuests: SetState<Nullable<UserQuest[]>>
    
    referrals: Nullable<Referral[]>
    setReferrals: SetState<Nullable<Referral[]>>
    
    leadmagnets: Nullable<LeadMagnet[]>
    setLeadmagnets: SetState<Nullable<LeadMagnet[]>>

    claimedLeadmagnets: Nullable<ClaimedLeadMagnet[]>
    setClaimedLeadmagnets: SetState<Nullable<ClaimedLeadMagnet[]>>
}


export interface GameProvideProps {
    children: ReactNode 
}