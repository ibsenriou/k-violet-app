import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'


import user from 'src/store/apps/user'
import auth from 'src/store/apps/auth'

export const store = configureStore({
    reducer: {
        auth,
        user,
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
