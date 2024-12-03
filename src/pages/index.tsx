// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from '@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = () => {
    return '/home'
}

const Home = () => {
    // ** Hooks
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        if (auth.user) {
            const homeRoute = getHomeRoute()

            // Redirect user to Home URL
            router.replace(homeRoute)
        }

    }, [auth.user, router])

    return <Spinner />
}

export default Home
