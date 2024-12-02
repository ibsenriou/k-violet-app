import { createSlice } from '@reduxjs/toolkit'

import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'

import { CondominiumService } from 'src/services/condominiumService'

import { createAppAsyncThunk } from 'src/store/utils'

import { selectCondominiumId } from '../../user'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchData = createAppAsyncThunk(
    'appCondominiumCommonArea/fetchData',
    async (_: undefined, { getState }) => {
        const condominiumId = selectCondominiumId(getState())
        const response = await CondominiumService.condominiumId_condominium_common_area.get({
            condominiumId: condominiumId
        })

        return response.data.results
    }
)

export const addCommonArea = createAppAsyncThunk(
    'appCondominiumCommonArea/addCommonArea',
    async (data: Partial<CondominiumCommonAreaType>, { getState, dispatch }) => {
        await CondominiumService.condominium_common_area.post(null, {
            name: data.name,
            description: data.description,
            capacity_of_people: data.capacity_of_people,
            does_it_have_usage_fee: data.does_it_have_usage_fee,
            does_it_requires_reservation: data.does_it_requires_reservation,
            does_it_allows_reservation_to_defaulters: data.does_it_allows_reservation_to_defaulters,
            does_it_have_entry_checklist: data.does_it_have_entry_checklist,
            does_it_have_exit_checklist: data.does_it_have_exit_checklist,
            fk_condominium_common_area_utilization_fee_history: data.fk_condominium_common_area_utilization_fee_history,

            fk_uhab: selectCondominiumId(getState())
        })

        dispatch(fetchData())
    }
)

export const updateCommonArea = createAppAsyncThunk(
    'appCondominiumCommonArea/updateCommonArea',
    async (data: Partial<CondominiumCommonAreaType>, { getState, dispatch }) => {
        await CondominiumService.condominium_common_areaId.patch(
            { commonAreaId: data.id! },
            {
                name: data.name,
                description: data.description,
                capacity_of_people: data.capacity_of_people,
                does_it_have_usage_fee: data.does_it_have_usage_fee,
                does_it_requires_reservation: data.does_it_requires_reservation,
                does_it_allows_reservation_to_defaulters: data.does_it_allows_reservation_to_defaulters,
                does_it_have_entry_checklist: data.does_it_have_entry_checklist,
                does_it_have_exit_checklist: data.does_it_have_exit_checklist,
                fk_condominium_common_area_utilization_fee_history:
                    data.fk_condominium_common_area_utilization_fee_history,

                fk_uhab: selectCondominiumId(getState())
            }
        )

        dispatch(fetchData())
    }
)

export const deleteCommonArea = createAppAsyncThunk(
    'appCondominiumCommonArea/deleteCommonArea',
    async (data: { id: string }, { getState, dispatch }) => {
        await CondominiumService.condominium_common_areaId.delete({ commonAreaId: data.id })
        dispatch(fetchData())
    }
)

export const appCondominiumCondominiumCommonAreasSlice = createSlice({
    name: 'appCondominiumCondominiumCommonAreas',
    initialState: {
        commonAreas: <CondominiumCommonAreaType[]>[]
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.commonAreas = action.payload
        })
    }
})

export default appCondominiumCondominiumCommonAreasSlice.reducer
