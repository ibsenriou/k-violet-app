import { ItemType } from './itemTypes'

export type ProductType = ItemType & {
    fk_measurement_unit: string
    measurement_unit_description: string
    account_description: string
}
