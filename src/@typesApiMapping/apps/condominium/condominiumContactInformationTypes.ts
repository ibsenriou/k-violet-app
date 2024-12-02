import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumContactInformationType = HomespaceBaseModel & {
    contact: string
    description: string
    fk_lookup_type_of_contact_information: string
    fk_condominium: string
}
