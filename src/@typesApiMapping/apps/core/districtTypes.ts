import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type DistrictType = HomespaceBaseModel & {
    district_name: string
    fk_city: string
}
