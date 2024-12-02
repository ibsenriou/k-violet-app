import { UhabType } from './uhabTypes'

export type CondominiumType = UhabType & {
    national_corporate_taxpayer_identification_number: string
    fk_address: string
    has_grouping: boolean
}
