import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumCommonAreaArchiveOfRulesType = HomespaceBaseModel & {
    description: string
    is_rule_active: boolean
    file_of_rules_attachment: string
    fk_condominium_common_area: string
    created_by: number
}
