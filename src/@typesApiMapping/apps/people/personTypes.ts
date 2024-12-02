import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'
import { PersonContactInformationType } from './personContactInformationTypes'

export type PersonType = HomespaceBaseModel & {
    person_contact_information_set: PersonContactInformationType[]
    name: string
    image: string | null
    fk_user: string
    fks_address: string[]
}
