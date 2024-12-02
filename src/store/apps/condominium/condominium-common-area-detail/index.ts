// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Type Imports
import { CondominiumCommonAreaArchiveOfRulesType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaArchiveOfRulesTypes'
import { CondominiumCommonAreaItemType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaItemTypes'
import { CondominiumCommonAreaReservationPeriodType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationPeriodTypes'
import { CondominiumCommonAreaReservationType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationTypes'
import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'
import { CondominiumCommonAreaUtilizationFeeHistoryType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaUtilizationFeeHistoryTypes'

import { CondominiumService } from 'src/services/condominiumService'

import { createAppAsyncThunk } from 'src/store/utils'

export const fetchData = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/fetchData',
    async (params: { id: string }) => {
        try {
            const [
                condominiumCommonArea,
                condominiumCommonAreaItems,
                condominiumCommonAreaArchiveOfRules,
                condominiumCommonAreaUtilizationFeeHistory,
                condominiumCommonAreaReservations,
                condominiumCommonAreaReservationPeriod
            ] = await Promise.all([
                CondominiumService.condominium_common_areaId.get({ commonAreaId: params['id'] }),
                CondominiumService.condominium_common_areaId_condominium_common_area_items.get({
                    commonAreaId: params['id']
                }),
                CondominiumService.condominium_common_area_archive_of_rules.get(null, {
                    fk_condominium_common_area: params['id']
                }),
                CondominiumService.condominium_common_area_utilization_fee_history.get(null, {
                    fk_common_area: params['id']
                }),
                CondominiumService.condominium_common_area_reservation.get(null, {
                    fk_condominium_common_area: params['id']
                }),
                CondominiumService.condominium_common_area_reservation_period.get(null, {
                    fk_condominium_common_area: params['id'],
                    is_period_active: true
                })
            ])

            return {
                commonArea: condominiumCommonArea.data,
                commonAreaItems: condominiumCommonAreaItems.data.results,
                commonAreaArchivesOfRules: condominiumCommonAreaArchiveOfRules.data.results,
                commonAreaUtilizationFeeHistories: condominiumCommonAreaUtilizationFeeHistory.data.results,
                commonAreaReservations: condominiumCommonAreaReservations.data.results,
                commonAreaReservationPeriods: condominiumCommonAreaReservationPeriod.data.results
            }
        } catch (error) {
            console.error('Redux fetch data error: ', error)
        }
    }
)

export const updateCondominiumCommonArea = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/updateCondominiumCommonArea',
    async (data: Partial<CondominiumCommonAreaType>, { dispatch }) => {
        const response = await CondominiumService.condominium_common_areaId.patch(
            { commonAreaId: data.id! },
            {
                name: data.name,
                description: data.description,
                capacity_of_people: data.capacity_of_people,
                does_it_requires_reservation: data.does_it_requires_reservation,
                does_it_allows_guests: data.does_it_allows_guests,
                working_week_days: data.working_week_days
            }
        )

        dispatch(fetchData({ id: data.id! }))

        return response.data
    }
)

export const addCondominiumCommonAreaItem = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/addCondominiumCommonAreaItem',
    async (data: Partial<CondominiumCommonAreaItemType>, { dispatch }) => {
        // ** Create Condominium Common Area Item:
        const response = await CondominiumService.condominium_common_area_item.post(null, {
            fk_condominium_common_area: data.fk_condominium_common_area,
            description: data.description,
            quantity_of_items: data.quantity_of_items,
            unitary_value: data.unitary_value,

            item_model: data.item_model,
            item_brand: data.item_brand,
            date_of_acquisition: data.date_of_acquisition || null,
            observations: data.observations
        })

        dispatch(fetchData({ id: data.fk_condominium_common_area! }))

        return response.data
    }
)

export const updateCondominiumCommonAreaItem = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/updateCondominiumCommonAreaItem',
    async (data: Partial<CondominiumCommonAreaItemType>, { dispatch }) => {
        const response = await CondominiumService.condominium_common_area_itemId.patch(
            { itemId: data.id! },
            {
                description: data.description,
                quantity_of_items: data.quantity_of_items,
                unitary_value: data.unitary_value,

                item_model: data.item_model,
                item_brand: data.item_brand,
                date_of_acquisition: data.date_of_acquisition || null,
                observations: data.observations
            }
        )

        dispatch(fetchData({ id: data.fk_condominium_common_area! }))

        return response.data
    }
)

export const deleteCondominiumCommonAreaItem = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/deleteCondominimCommonAreaItem',
    async (data: { id: string; condominimCommonArea: string }, { dispatch }) => {
        const response = await CondominiumService.condominium_common_area_itemId.delete({ itemId: data.id })
        dispatch(fetchData({ id: data.condominimCommonArea }))

        return response.data
    }
)

export const addCondominiumCommonAreaReservationPeriod = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/addCondominiumCommonAreaReservationPeriod',
    async (data: Partial<CondominiumCommonAreaReservationPeriodType>, { dispatch }) => {
        const response = await CondominiumService.condominium_common_area_reservation_period.post(null, {
            fk_condominium_common_area: data.fk_condominium_common_area,
            start_time: data.is_full_day ? null : data.start_time,
            end_time: data.is_full_day ? null : data.end_time,
            is_full_day: data.is_full_day
        })

        dispatch(fetchData({ id: data.fk_condominium_common_area! }))

        return response.data
    }
)

export const deactivateCondominiumCommonAreaReservationPeriod = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/deactivateCondominiumCommonAreaReservationPeriod',
    async (data: { id: string; fk_condominium_common_area: string }, { dispatch }) => {
        const response = await CondominiumService.condominium_common_area_reservation_periodId.patch(
            { reservationPeriodId: data.id },
            {
                is_period_active: false
            }
        )

        dispatch(fetchData({ id: data.fk_condominium_common_area }))

        return response.data
    }
)

export const updateCondominiumCommonAreaTabReservationSubTabConfig = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/updateCondominiumCommonAreaTabReservationSubTabConfig',
    async (data: Partial<CondominiumCommonAreaType>, { dispatch }) => {
        // ** Update Reserva de Area Comum Config:
        if (data['id'] === undefined) {
            throw new Error('The id of the common area is undefined')
        }
        const response = await CondominiumService.condominium_common_areaId.patch(
            { commonAreaId: data['id'] },
            {
                does_it_have_usage_fee: data.does_it_have_usage_fee,
                does_it_allows_reservation_to_defaulters: data.does_it_allows_reservation_to_defaulters,
                does_it_have_entry_checklist: data.does_it_have_entry_checklist,
                does_it_have_exit_checklist: data.does_it_have_exit_checklist
            }
        )

        dispatch(fetchData({ id: data['id'] }))

        return response.data
    }
)

export const addCondominiumCommonAreaUtilizationFeeHistory = createAppAsyncThunk(
    'pagesCondominiumCommonAreaDetail/addHistoricoDeValorDeReservaDeAreaComum',
    async (data: Partial<CondominiumCommonAreaUtilizationFeeHistoryType>, { dispatch }) => {
        const response = await CondominiumService.condominium_common_area_utilization_fee_history.post(null, {
            value: data.value,
            date_since_its_valid: data.date_since_its_valid,
            fk_common_area: data.fk_common_area,
            created_by: data.created_by
        })

        dispatch(fetchData({ id: data.fk_common_area! }))

        return response.data
    }
)

export const pagesCondominiumCommonAreaDetailSlice = createSlice({
    name: 'appCondominium-condominiumCommonAreaDetail',
    initialState: {
        commonArea: <CondominiumCommonAreaType>{},
        commonAreaItems: <CondominiumCommonAreaItemType[]>[],
        commonAreaArchivesOfRules: <CondominiumCommonAreaArchiveOfRulesType[]>[],
        commonAreaUtilizationFeeHistories: <CondominiumCommonAreaUtilizationFeeHistoryType[]>[],
        commonAreaReservations: <CondominiumCommonAreaReservationType[]>[],
        commonAreaReservationPeriods: <CondominiumCommonAreaReservationPeriodType[]>[]
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.commonArea = action.payload?.commonArea || state.commonArea
            state.commonAreaItems = action.payload?.commonAreaItems || state.commonAreaItems
            state.commonAreaArchivesOfRules =
                action.payload?.commonAreaArchivesOfRules || state.commonAreaArchivesOfRules
            state.commonAreaUtilizationFeeHistories =
                action.payload?.commonAreaUtilizationFeeHistories || state.commonAreaUtilizationFeeHistories
            state.commonAreaReservations = action.payload?.commonAreaReservations || state.commonAreaReservations
            state.commonAreaReservationPeriods =
                action.payload?.commonAreaReservationPeriods || state.commonAreaReservationPeriods
        })
    }
})

export default pagesCondominiumCommonAreaDetailSlice.reducer
