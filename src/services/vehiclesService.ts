import { VehicleManufacturerType } from '@typesApiMapping/apps/vehicles/vehicleManufacturerTypes'
import { VehicleModelType } from '@typesApiMapping/apps/vehicles/vehicleModelTypes'
import { VehicleType } from '@typesApiMapping/apps/vehicles/vehicleTypes'
import { createUrl } from './Url'

export const VehiclesService = {
    vehicle: createUrl<null, VehicleType[]>('/vehicles/vehicle/'),
    vehicleId: createUrl<{ vehicleId: string }, VehicleType>('/vehicles/vehicle/:vehicleId/'),
    vehicle_manufacturer: createUrl<null, VehicleManufacturerType[]>('/vehicles/vehicle_manufacturer/'),
    vehicle_manufacturerId: createUrl<{ vehicleManufacturerId: string }, VehicleManufacturerType>(
        '/vehicles/vehicle_manufacturer/:vehicleManufacturerId/'
    ),
    vehicle_model: createUrl<null, VehicleModelType[]>('/vehicles/vehicle_model/'),
    vehicle_modelId: createUrl<{ vehicleModelId: string }, VehicleModelType>(
        '/vehicles/vehicle_model/:vehicleModelId/'
    ),
    vehicle_model_by_manufacturerId: createUrl<{ vehicleManufacturerId: string }, VehicleModelType[]>(
        '/vehicles/vehicle_model/?fk_vehicle_manufacturer=:vehicleManufacturerId'
    ),
    report_vehicle: createUrl<{ fk_condominium: string }>('/vehicles/report/vehicle/?fk_condominium=:fk_condominium')
}
