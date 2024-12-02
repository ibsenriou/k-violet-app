import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type ReadingItemType = HomespaceBaseModel & {
    fk_measurement_unit: string
    measurement_unit_description: string
    description: string
    price: number | undefined
    character_abbreviation: string
    fk_reading_item: string
    measurementUnit: string
    amount: number
    reading_item: string
    reading_itemId: string
}
