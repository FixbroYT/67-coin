import { UserSchema, UpgradeSchema, UserUpgradeSchema, LocationSchema, UserLocationSchema, QuestSchema, UserQuestSchema, ReferralSchema, LeadMagnetSchema, ClaimedLeadMagnetSchema, DailyStatsSchema } from "../types/Game"
import { createDefaultResponse, BuyUpgradeDataSchema, BuyLocationDataSchema, SetLocationDataSchema, LeadMagnetBonusDataSchema, RefBonusDataSchema, SpinSlotsDataSchema, PassiveIncomeDataSchema } from "../types/Api"
import { apiClient } from "./client"
import { z } from "zod"
import { validateResponse } from "./validation"

const fetchEntity = async<Schema extends z.ZodTypeAny> (url: string, schema: Schema): Promise<z.infer<Schema> | undefined> => {
    const responsePromise = apiClient.get(url)
    return await validateResponse(responsePromise, schema)
}

const postRequest = async<Schema extends z.ZodTypeAny> (url: string, payload: object, schema: Schema): Promise<z.infer<Schema> | undefined> => {
    const responsePromise = apiClient.post(url, payload)
    return await validateResponse(responsePromise, schema)
}

export const gameApi = {
    getUser: () => fetchEntity("users/get-user-info", createDefaultResponse(UserSchema)),
    claimPendingPassiveIncome: () => postRequest("users/claim-pending-passive-income", {}, createDefaultResponse(PassiveIncomeDataSchema)),
    
    getUpgrades: () => fetchEntity("upgrades/get-all", createDefaultResponse(z.array(UpgradeSchema))), 
    getUserUpgrades: () => fetchEntity("upgrades/get-user-upgrades", createDefaultResponse(z.array(UserUpgradeSchema))),
    buyUpgrade: (upgrade_id: number) => postRequest("upgrades/buy-upgrade", { upgrade_id: upgrade_id }, createDefaultResponse(BuyUpgradeDataSchema)),

    getLocations: () => fetchEntity("locations/get-all", createDefaultResponse(z.array(LocationSchema))),
    getUserLocations: () => fetchEntity("locations/get-user-locations", createDefaultResponse(z.array(UserLocationSchema))),
    buyLocation: (location_id: number) => postRequest("locations/buy-location", { location_id: location_id }, createDefaultResponse(BuyLocationDataSchema)),
    setLocation: (location_id: number) => postRequest("locations/set-location", { location_id: location_id }, createDefaultResponse(SetLocationDataSchema)),

    getQuests: () => fetchEntity("quests/get-all", createDefaultResponse(z.array(QuestSchema))),
    getUserQuests: () => fetchEntity("quests/get-user-quests", createDefaultResponse(z.array(UserQuestSchema))),

    getReferrals: () => fetchEntity("referrals/get-all", createDefaultResponse(z.array(ReferralSchema))),
    getRefBonus: (referred_tg_id: number) => postRequest("referrals/get-ref-bonus", { referred_tg_id: referred_tg_id }, createDefaultResponse(RefBonusDataSchema)),

    getLeadmagnets: () => fetchEntity("leadmagnets/get-all", createDefaultResponse(z.array(LeadMagnetSchema))),
    getClaimedLeadmagnets: () => fetchEntity("leadmagnets/get-claimed", createDefaultResponse(z.array(ClaimedLeadMagnetSchema))),
    getLeadmagnetBonus: (leadmagnet_id: number) => postRequest("leadmagnets/get-bonus", { leadmagnet_id: leadmagnet_id }, createDefaultResponse(LeadMagnetBonusDataSchema)),

    getDailyStats: () => fetchEntity("minigames/get-user-minigames-data", createDefaultResponse(DailyStatsSchema)),
    spinSlots: (stakeValue: number) => postRequest("minigames/slots/spin", { stake: stakeValue }, createDefaultResponse(SpinSlotsDataSchema))
}
