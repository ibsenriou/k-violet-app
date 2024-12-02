import type { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type UhabIdealFractionType = HomespaceBaseModel & {
    fk_ideal_fraction: string
    fk_uhab: string
    percentage: number
}

export type NewUhabIdealFractionType = Omit<UhabIdealFractionType, keyof HomespaceBaseModel>
