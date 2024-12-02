// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import { createAppAsyncThunk } from 'src/store/utils'

interface DataParams {
    q: string
}

// ** Fetch Invoices
export const fetchData = createAppAsyncThunk('appPermissions/fetchData', async (params: DataParams) => {
    const response = await axios.get('/apps/permissions/data', {
        params
    })

    return response.data
})

export const appPermissionsSlice = createSlice({
    name: 'appPermissions',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload.permissions
            state.params = action.payload.params
            state.allData = action.payload.allData
            state.total = action.payload.total
        })
    }
})

export default appPermissionsSlice.reducer
