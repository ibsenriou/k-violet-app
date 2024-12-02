import { createSlice } from '@reduxjs/toolkit'

import { checkMatchType, createAppAsyncThunk } from 'src/store/utils'

import type { UserType } from 'src/@typesApiMapping/apps/userTypes'

import { AuthService } from 'src/services/authService'

import { displayToast } from 'src/views/utils/displayToast'
import { RootState } from 'src/store'
import { AxiosError } from 'axios'
import { fetchData } from '../user'

type LoginParams = {
    username: string
    password: string
}
export const login = createAppAsyncThunk('appAuth/login', async (params: LoginParams, { dispatch }) => {
    await AuthService.login.post(null, params)
    const response = await AuthService.user.get()
    dispatch(fetchData({ user: response.data }))
    return response.data
})

export const logout = createAppAsyncThunk('appAuth/logout', async () => {
    await AuthService.logout.post(null, null)
    window.location.href = '/'
})

export const checkAuth = createAppAsyncThunk('appAuth/checkAuth', async (_, { dispatch }) => {
    try {
        const response = await AuthService.user.get()
        dispatch(fetchData({ user: response.data }))
        return response.data
    } catch (error) {
        if ((error as AxiosError).response?.status === 403) {
            return null
        } else {
            throw error
        }
    }
})

export const authSlice = createSlice({
    name: 'appUsers',
    initialState: {
        user: null as UserType | null,
        loading: true
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload
        })
        builder.addCase(logout.fulfilled, state => {
            state.user = null
        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addMatcher(checkMatchType('appAuth', 'pending', 'login'), state => {
            state.loading = true
        })
        builder.addMatcher(checkMatchType('appAuth', 'fulfilled'), state => {
            state.loading = false
        })
        builder.addMatcher(checkMatchType('appAuth', 'rejected'), (state, action) => {
            state.loading = false
            displayToast({
                error: 'error'
            })
        })
    }
})

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthLoading = (state: RootState) => state.auth.loading

export default authSlice.reducer
