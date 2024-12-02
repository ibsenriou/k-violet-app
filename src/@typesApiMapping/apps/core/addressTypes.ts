import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type AddressType = HomespaceBaseModel & {
    street_name: string
    number: string
    complement: string
    fk_uhab: string
    fk_person: string
    fk_postal_code: string
    fk_state: string
    fk_city: string
    fk_district: string
}
