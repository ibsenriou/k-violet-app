// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UserLayoutType = {
    id: string | string[] | undefined
}

export type UsersType = {
    id: string
    role: string
    email: string
    status: string
    avatar: string
    company: string
    country: string
    contact: string
    fullName: string
    username: string
    currentPlan: string
    avatarColor?: ThemeColor
}
