import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type StateType = HomespaceBaseModel & {
    state_name: string
    state_two_digits_code: string
    fk_country: string
}
