import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

import chat from 'src/store/apps/chat'
import aboutTheCondominium from 'src/store/apps/condominium/about-the-condominium'
import condominiumCommonAreaDetail from 'src/store/apps/condominium/condominium-common-area-detail'
import condominiumCommonAreas from 'src/store/apps/condominium/condominium-common-areas'
import residentialDetail from 'src/store/apps/condominium/residentialDetail'
import commercialDetail from 'src/store/apps/condominium/commercialDetail'
import residentials from 'src/store/apps/condominium/residentials'
import commercials from 'src/store/apps/condominium/commercials'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import permissions from 'src/store/apps/permissions'
import user from 'src/store/apps/user'
import auth from 'src/store/apps/auth'

import calendar from 'src/store/apps/calendar'

export const store = configureStore({
    reducer: {
        auth,
        user,
        chat,
        email,
        invoice,
        permissions,

        calendar,

        aboutTheCondominium,
        residentialDetail,
        residentials,
        commercialDetail,
        commercials,
        condominiumCommonAreas,
        condominiumCommonAreaDetail
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => store.dispatch

export type AppDispatch = typeof store.dispatch
