import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumCommonAreaUtilizationFeeHistoryType = HomespaceBaseModel & {
    date_since_its_valid: string
    value: string
    fk_common_area: string
    created_by: string
}
