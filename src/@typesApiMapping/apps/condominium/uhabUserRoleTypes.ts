import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type UhabUserRoleType = HomespaceBaseModel & {
    is_this_the_main_role: boolean
    fk_person: string
    fk_uhab: string
    fk_lookup_type_of_uhab_user_role: string
}
