import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useRouter } from 'next/router'

import { RootState, useAppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/condominium/residentialDetail'

import FallbackSpinner from '@core/components/spinner'

import ResidentialViewPage from 'src/views/pages/condominium/residentials/view/ResidentialViewPage'

const ResidentialView = () => {
    const router = useRouter()

    const dispatch = useAppDispatch()

    const store = useSelector((state: RootState) => state.residentialDetail)
    const condominium = useSelector((state: RootState) => state.aboutTheCondominium.data.condominium)

    useEffect(() => {
        if (router.query.id) {
            dispatch(fetchData({ id: router.query.id.toString() }))
        }
    }, [dispatch, router.query.id])

    if (!router.isReady || !router.query.id || !store.data.residential || !condominium?.name) {
        return <FallbackSpinner />
    }

    if (router.query.id != store.data.residential?.id) {
        return <FallbackSpinner />
    }

    return <ResidentialViewPage />
}

export default ResidentialView
