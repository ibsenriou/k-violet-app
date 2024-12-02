// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState, useAppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/condominium/condominium-common-area-detail'

// ** Demo Components Imports
import FallbackSpinner from '@core/components/spinner'

// ** Components Imports
import CondominiumCommonAreaMainView from 'src/views/pages/condominium/condominium-common-areas/main/CondominiumCommonAreaMainView'

/*
  High Order Component (HOC) for the condominium common area detail page.

  This component is responsible for fetching the data from the API and passing it to the CondominiumCommonAreaMainView component.
*/
const CondominiumCommonAreaDetail = () => {
    // ** Router
    const router = useRouter()

    // ** Store
    const dispatch = useAppDispatch()
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    useEffect(() => {
        if (router.query.id) {
            dispatch(fetchData({ id: router.query.id.toString() })) // Convert the id to string because it comes from the router as an array of strings
        }
    }, [dispatch, router.query.id])

    if (!router.isReady || !router.query.id || !store.commonArea) {
        return <FallbackSpinner />
    }

    // If the id from the router is different from the id from the store, it means that the data is not ready yet.
    // This can happen when the user opens a common area, loads into the store, and then opens another common area.
    // In this case, the store will have the data from the first common area, but the router will have the id from the second common area.
    // This will cause the page to render the first common area data, and then the second common area data.
    // This hack prevents this from happening.
    if (router.query.id != store.commonArea?.id) {
        return <FallbackSpinner />
    }

    return <CondominiumCommonAreaMainView />
}

CondominiumCommonAreaDetail.acl = {
    action: 'read',
    subject: 'condominium-common-areas-page--detail'
}

export default CondominiumCommonAreaDetail
