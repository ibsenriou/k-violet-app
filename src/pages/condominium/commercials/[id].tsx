import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useRouter } from 'next/router'

import { RootState, useAppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/condominium/commercialDetail'

import FallbackSpinner from '@core/components/spinner'

import CommercialViewPage from 'src/views/pages/condominium/commercials/view/CommercialViewPage'

const CommercialView = () => {
    const router = useRouter()

    const dispatch = useAppDispatch()

    const store = useSelector((state: RootState) => state.commercialDetail)
    const condominium = useSelector((state: RootState) => state.aboutTheCondominium.data.condominium)

    useEffect(() => {
        if (router.query.id) {
            dispatch(fetchData({ id: router.query.id.toString() }))
        }
    }, [dispatch, router.query.id])

    if (!router.query.id || !store.data.commercial || !condominium?.name) {
        return <FallbackSpinner />
    }

    return <CommercialViewPage />
}

export default CommercialView
