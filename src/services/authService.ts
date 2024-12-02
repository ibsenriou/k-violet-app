import { UserType } from '@typesApiMapping/apps/userTypes'
import { createUrl } from './Url'

export const AuthService = {
    login: createUrl<null, { username: string; password: string }>('/auth/login/'),
    logout: createUrl<null, null>('/auth/logout/'),
    password_change: createUrl('/auth/password/change/'),
    password_reset: createUrl('/auth/password/reset/'),
    password_reset_confirm: createUrl('/auth/password/reset/confirm/'),
    user: createUrl<null, UserType>('/auth/user/')
}
