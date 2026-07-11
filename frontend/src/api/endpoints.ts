import { UserSchema, UpgradeSchema, UserUpgradeSchema, LocationSchema, UserLocationSchema, QuestSchema, UserQuestSchema, ReferralSchema, LeadMagnetSchema, ClaimedLeadMagnetSchema } from "../types/Game"
import { createDefaultResponse, BuyUpgradeDataSchema } from "../types/Api"
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
    
    getUpgrades: () => fetchEntity("upgrades/get-all", createDefaultResponse(z.array(UpgradeSchema))), 
    getUserUpgrades: () => fetchEntity("upgrades/get-user-upgrades", createDefaultResponse(z.array(UserUpgradeSchema))),
    buyUpgrade: (upgrade_id: number) => postRequest("upgrades/buy-upgrade", { upgrade_id: upgrade_id }, createDefaultResponse(BuyUpgradeDataSchema)),

    getLocations: () => fetchEntity("locations/get-all", createDefaultResponse(z.array(LocationSchema))),
    getUserLocations: () => fetchEntity("locations/get-user-locations", createDefaultResponse(z.array(UserLocationSchema))),

    getQuests: () => fetchEntity("quests/get-all", createDefaultResponse(z.array(QuestSchema))),
    getUserQuests: () => fetchEntity("quests/get-user-quests", createDefaultResponse(z.array(UserQuestSchema))),

    getReferrals: () => fetchEntity("referrals/get-all", createDefaultResponse(z.array(ReferralSchema))),

    getLeadmagnets: () => fetchEntity("leadmagnets/get-all", createDefaultResponse(z.array(LeadMagnetSchema))),
    getClaimedLeadmagnets: () => fetchEntity("leadmagnets/get-claimed", createDefaultResponse(z.array(ClaimedLeadMagnetSchema)))
}
