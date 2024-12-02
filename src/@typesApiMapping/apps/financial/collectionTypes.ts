import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CollectionItemType = HomespaceBaseModel & {
    id: string
    uhab_name: string
    amount: number
    ideal_fraction_value: number
    fk_uhab: string
    fk_collection: string
}

export type CollectionType = HomespaceBaseModel & {
    id: string
    account_description: string
    competence: string
    responsible: string
    nature: string
    amount: number
    total_amount: number
    description: string
    type: string
    format: string
    recurrence_index: number
    recurrence_value: number
    recurrence_type: string
    ideal_fraction_name: string
    items: CollectionItemType[]
    fk_competence_month: string
    fk_competence_year: string
    fk_ideal_fraction: string
    fk_account: string
    fk_parent_collection: string | null
    charge_created: boolean
}
