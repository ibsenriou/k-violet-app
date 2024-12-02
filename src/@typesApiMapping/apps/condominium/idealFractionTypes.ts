import type { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'
import type { ApportionmentType } from './apportionmentTypes'
import type { UhabIdealFractionType } from './uhabIdealFractionTypes'

export enum DistributionType {
    MANUAL_DISTRIBUTION = 1,
    EQUAL_DISTRIBUTION_PER_UNIT = 2
}

export type IdealFractionType = ApportionmentType & {
    is_main: boolean
    activated_at?: string
    distribution_type: DistributionType
}

export type NewIdealFractionType = Omit<IdealFractionType, keyof HomespaceBaseModel>

export type IdealFractionItemsUpdateType = {
    ideal_fraction: IdealFractionType
    items: UhabIdealFractionType[]
}
