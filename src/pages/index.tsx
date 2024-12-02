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
export const getHomeRoute = (role: string) => {
    if (role === 'Individual Condominium User') return '/home'
    else return '/home'
}

const Home = () => {
    // ** Hooks
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        if (auth.user && auth.user.user_roles?.length > 0) {
            const homeRoute = getHomeRoute(auth.user.user_roles[0]?.name)

            // Redirect user to Home URL
            router.replace(homeRoute)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <Spinner />
}

export default Home
