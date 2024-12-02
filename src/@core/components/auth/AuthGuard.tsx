// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
    children: ReactNode
    fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
    const { children, fallback } = props
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        if (auth.loading) {
            return
        }

        if (!auth.user) {
            if (router.asPath !== '/') {
                router.replace({
                    pathname: '/login',
                    query: { returnUrl: router.asPath }
                })
            } else {
                router.replace('/login')
            }
        }

        // if (auth.user && !auth.user?.access_roles.some(ar => ar.fk_condominium)) {
        //     if (router.pathname !== '/error/unrecovery') {
        //         router.replace('/error/unrecovery')
        //     }
        // }
    }, [router, auth])

    useEffect(() => {
        if (!auth.user) {
            auth.checkAuth()
        }
    }, [])

    if (auth.loading || auth.user === null) {
        return fallback
    }

    return <>{children}</>
}

export default AuthGuard
