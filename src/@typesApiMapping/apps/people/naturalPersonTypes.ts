import { PersonType } from './personTypes'

export type NaturalPersonType = PersonType & {
    id: number
    date_of_birth: string
    national_individual_taxpayer_identification: string
    has_natural_person_given_permission_to_use_his_image: boolean
    avatar_image_file_name: string
}
