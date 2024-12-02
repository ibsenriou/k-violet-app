import { AccessRole } from './accessRoleType'

export type UserLayoutType = {
    id: string | string[] | undefined
}

export type UserType = {
    user_roles: AccessRole[]
    email: string
    first_name: string
    last_name: string
    id: string
}
