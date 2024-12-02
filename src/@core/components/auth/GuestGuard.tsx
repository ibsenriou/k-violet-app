import { ReactElement, ReactNode, useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
    children: ReactNode
    fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
    const { children, fallback } = props
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) {
            return
        }
    }, [router])

    useEffect(() => {
        if (auth.user) {
            router.replace('/home')
        }
    }, [auth.user, router])

    useEffect(() => {
        if (!auth.user) {
            auth.checkAuth()
        }
    }, [])

    if (auth.loading || (!auth.loading && auth.user)) {
        return fallback
    }

    return <>{children}</>
}

export default GuestGuard
