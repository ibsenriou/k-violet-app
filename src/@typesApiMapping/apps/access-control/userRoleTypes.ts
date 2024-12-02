import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type UserRoleType = HomespaceBaseModel & {
    fk_user: string
    fk_role: string
    user_first_name: string
    user_email: string
}
