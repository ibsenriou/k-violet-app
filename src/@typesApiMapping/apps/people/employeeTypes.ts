import { NaturalPersonType } from './naturalPersonTypes'

export type EmployeeType = NaturalPersonType & {
    working_week_days: string
}
