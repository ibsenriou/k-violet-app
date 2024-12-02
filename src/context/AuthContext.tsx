import { useQueryClient } from '@tanstack/react-query'
import { UserType } from '@typesApiMapping/apps/userTypes'
import { useRouter } from 'next/router'
import { ReactNode, createContext } from 'react'

import { useAppDispatch, useAppSelector } from 'src/store'
import { checkAuth, login, logout, selectAuthLoading, selectAuthUser } from 'src/store/apps/auth'

export type AuthContextType = {
    login: (params: LoginParams) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    loading: boolean
    user: UserType | null
}

export type LoginParams = {
    username: string
    password: string
}

export type RegisterParams = {
    email: string
    username: string
    password: string
}

const AuthContext = createContext<AuthContextType>({
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    loading: false,
    user: null
})

type Props = {
    children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
    const queryClient = useQueryClient()
    const loading = useAppSelector(selectAuthLoading)
    const user = useAppSelector(selectAuthUser)
    const router = useRouter()
    const dispatch = useAppDispatch()

    async function handleLogin(params: LoginParams) {
        queryClient.invalidateQueries({
            queryKey: ['access_control']
        })
        await dispatch(login(params))
    }

    async function handleLogout() {
        await dispatch(logout())
        router.push('/login')
    }

    async function handleCheckAuth() {
        await dispatch(checkAuth())
    }

    const values: AuthContextType = {
        login: handleLogin,
        logout: handleLogout,
        checkAuth: handleCheckAuth,
        loading,
        user
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
