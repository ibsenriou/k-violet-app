import { PersonType } from './personTypes'

export type LegalPersonType = PersonType & {
    national_corporate_taxpayer_identification_number: string
}
