import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type CityType = HomespaceBaseModel & {
    city_name: string
    fk_state: string
}
