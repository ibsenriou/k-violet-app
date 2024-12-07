import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from 'src/store'
import { checkMatchType, createAppAsyncThunk } from 'src/store/utils'

import type { UserType } from 'src/@typesApiMapping/apps/userTypes'


import { displayToast } from 'src/views/utils/displayToast'
import { AuthService } from 'src/services/authService'

type FetchDataParams = {
    user: UserType
}
export const fetchData = createAppAsyncThunk(
    'appUsers/fetchData',
    async ({ user: _user }: FetchDataParams, { dispatch, getState }) => {
        const user = _user || getState().auth.user!

        return { user }
    }
)


export const changePassword = createAppAsyncThunk(
  'appUsers/changePassword',
  async (data: { current_password: string; new_password: string; confirm_password: string }, { dispatch, getState }) => {
    // Validate if current password is correct
    const confirmPasswordResponse = await AuthService.login.post(null, {
      username: (getState() as RootState).auth.user!.email,
      password: data.current_password
    })

    if (confirmPasswordResponse.status !== 200) {
      return false
    }

    await AuthService.password_change.post(null, {
      new_password2: data.confirm_password,
      new_password1: data.new_password
    })

    return true
  }
)

export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState: {
        user: <UserType>{},
        loading: false
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.user = action.payload.user
        })

        builder.addMatcher(checkMatchType('appUsers', 'pending'), state => {
            state.loading = true
        })
        builder.addMatcher(checkMatchType('appUsers', 'fulfilled'), state => {
            state.loading = false
        })
        builder.addMatcher(checkMatchType('appUsers', 'rejected'), state => {
            state.loading = false
            displayToast({
                error: 'error'
            })
        })
    }
})

export const selectUser = (state: RootState) => (state.auth.user)

export const selectUserLoading = (state: RootState) => state.user.loading

export default appUsersSlice.reducer
