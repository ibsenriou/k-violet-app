import { UhabType } from './uhabTypes'

export type CommercialType = UhabType & {
    fk_lookup_type_of_commercial: string
}
