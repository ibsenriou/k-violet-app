import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type CountryType = HomespaceBaseModel & {
    country_name: string
    country_two_digits_code?: string
    country_three_digits_code?: string
}
