import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type VehicleModelType = HomespaceBaseModel & {
    description: string
    fk_vehicle_manufacturer: string
}
