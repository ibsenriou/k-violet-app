import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type PersonContactInformationType = HomespaceBaseModel & {
    _type_of_contact_description: string
    _type_of_contact_information: string
    description: string
    fk_person: string
    fk_lookup_type_of_contact_information: string
}
