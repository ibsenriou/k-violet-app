import { UhabType } from './uhabTypes'

export type GarageType = UhabType & {
    number_of_spots: number
    is_garage_being_used: boolean
    is_garage_available_for_rent: boolean
    is_drawer_type_garage: boolean
    is_covered_type_garage: boolean
}
