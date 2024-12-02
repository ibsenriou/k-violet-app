import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumCommonAreaItemType = HomespaceBaseModel & {
    description: string
    unitary_value: string
    quantity_of_items: number

    item_model: string
    item_brand: string
    date_of_acquisition: string | null
    observations: string

    fk_condominium_common_area: string
}
