import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type VehicleType = HomespaceBaseModel & {
    vehicle_plate: string
    manufacturing_year: string
    fk_vehicle_model: string
    fk_color: string
    fk_residential: string
}
