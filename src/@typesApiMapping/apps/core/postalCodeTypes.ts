import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type PostalCodeType = HomespaceBaseModel & {
    postal_code_number: string
    street_name: string | null
    fk_city: string
    fk_district: string | null
}
