import { boolean, success, z } from "zod"


export const BaseErrorSchema = z.object({
    code: z.string(),
    message: z.string()
})

export const createDefaultResponse = <T extends z.ZodTypeAny>(dataschema: T) => {
    return z.union([
        z.object({
            success: z.literal(true),
            data: dataschema
        }),
        z.object({
            success: z.literal(false),
            error: BaseErrorSchema
        })
    ])
}

export type ResponseUnion<T> = {
    success: true,
    data: T
} | {
    success: false,
    error: z.infer<typeof BaseErrorSchema>
}

export const ProcessClickResp = z.object({
    coins: z.number(),
    xp: z.number(),
    energy: z.number(),
    total_taps: z.number()
})
export type ProcessClickResp = z.infer<typeof ProcessClickResp>

export const PendingRefBonusDataSchema = z.object({
    coins: z.number(),
    claimed_coins: z.number(),
    delta_time: z.number(),
})
export type PendingRefBonusData = z.infer<typeof PendingRefBonusDataSchema>

export const PassiveIncomeDataSchema = z.object({
    coins: z.number(),
    claimed_coins: z.number(),
    delta_time: z.number(),
})
export type PassiveIncomeData = z.infer<typeof PassiveIncomeDataSchema>

export const EnergyDataSchema = z.object({
    energy: z.number(),
    energy_restoration: z.number(),
    max_energy: z.number(),
})
export type EnergyData = z.infer<typeof EnergyDataSchema>

export const BuyUpgradeDataSchema = z.object({
    coins: z.number(),
    upgrade_count: z.number(),
    cost: z.number(),
    bonus: z.number(),
    delta_bonus: z.number(),
    passive_income: PassiveIncomeDataSchema.nullable(),
    energy: EnergyDataSchema.nullable(),
})
export type BuyUpgradeData = z.infer<typeof BuyUpgradeDataSchema>

export const SetLocationDataSchema = z.object({
    current_loc_id: z.number(),
    click_income: z.number(),
})
export type SetLocationData = z.infer<typeof SetLocationDataSchema>

export const BuyLocationDataSchema = z.object({
    coins: z.number(),
    location_id: z.number(),
})
export type BuyLocationData = z.infer<typeof BuyLocationDataSchema>

export const RefBonusDataSchema = z.object({
    coins: z.number(),
    earned_coins: z.number(),
})
export type RefBonusData = z.infer<typeof RefBonusDataSchema>

export const LeadMagnetBonusDataSchema = z.object({
    coins: z.number(),
    leadmagnet_id: z.number(),
})
export type LeadMagnetBonusData = z.infer<typeof LeadMagnetBonusDataSchema>

export const SpinSlotsDataSchema = z.object({
    coins: z.number(),
    win: z.number(),
    combination: z.array(z.string()),
    daily_deposit: z.number(),
})
export type SpinSlotsData = z.infer<typeof SpinSlotsDataSchema>