import { UhabType } from './uhabTypes'

export type ResidentialType = UhabType & {
    fk_lookup_type_of_residential: string
    residential_grouping: string
}
