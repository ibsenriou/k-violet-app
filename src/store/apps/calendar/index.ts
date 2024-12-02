// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { AddEventType, EventType } from '@typesApiMapping/apps/calendarTypes'
import toast from 'react-hot-toast'
import { CondominiumService } from 'src/services/condominiumService'

import { createAppAsyncThunk } from 'src/store/utils'

interface DataParams {
    commonAreaId: string
}

// ** Fetch Condominium Common Area Reservations
export const fetchCondominiumCommonAreaReservations = createAppAsyncThunk(
    'appCalendar/fetchCondominiumCommonAreaReservations',
    async (params: DataParams) => {
        const response = await CondominiumService.condominium_common_area_reservation.get(null, {
            fk_condominium_common_area: params.commonAreaId
        })

        return response.data.results
    }
)

// ** Add Event
export const addReservation = createAppAsyncThunk(
    'appCalendar/addReservation',
    async (event: AddEventType, { getState, dispatch }) => {
        const startDate = event.start as Date
        const dateParsedYYYYMMDD = startDate.toISOString().split('T')[0]

        try {
            const response = await CondominiumService.condominium_common_area_reservation.post(null, {
                fk_condominium_common_area: event.fk_condominium_common_area,
                reservation_date: dateParsedYYYYMMDD,
                fk_uhab_as_reservant: event.fk_uhab_as_reservant,
                fk_common_area_reservation_period: event.fk_common_area_reservation_period
            })

            dispatch(
                fetchCondominiumCommonAreaReservations({
                    commonAreaId: event.fk_condominium_common_area
                })
            )

            toast.success(
                'Reserva criada com sucesso!',
                {
                    position: 'bottom-left',
                    duration: 10000
                }
            )

            return response.data.event
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error(
                  'Não foi possível criar a reserva. Por favor, verifique se a data selecionada é válida. Observação: Não é possível adicionar mais de uma reserva para o mesmo dia e período.',
                  {
                      position: 'bottom-left',
                      duration: 10000
                  }
                )
            }
        }
    }
)

// ** Update Event
export const updateReservation = createAppAsyncThunk(
    'appCalendar/updateReservation',
    async (event: EventType, { getState, dispatch }) => {
        const startDate = event.start as Date
        const dateParsedYYYYMMDD = startDate.toISOString().split('T')[0]

        try {
            const response = await CondominiumService.condominium_common_area_reservationId.patch(
                { reservationId: event.id },
                {
                    reservation_date: dateParsedYYYYMMDD,
                    fk_uhab_as_reservant: event.fk_uhab_as_reservant,
                    fk_common_area_reservation_period: event.fk_common_area_reservation_period
                }
            )

            toast.success(
                'Reserva atualizada com sucesso!',
                {
                    position: 'bottom-left',
                    duration: 10000
                }
            )

            dispatch(
                fetchCondominiumCommonAreaReservations({
                    commonAreaId: event.fk_condominium_common_area
                })
            )

            return response.data
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error(
                  'Não foi possível atualizar a reserva. Por favor, verifique se a data selecionada é válida. Observação: Não é possível adicionar mais de uma reserva para o mesmo dia e período.',
                  {
                        position: 'bottom-left',
                        duration: 10000
                  }
                )
            }
        }
    }
)

// ** Delete Event
export const deleteReservation = createAppAsyncThunk(
    'appCalendar/deleteReservation',
    async (id: string, { getState, dispatch }) => {
        const commonAreaID = getState().condominiumCommonAreaDetail.commonArea.id

        try {
            const response = await CondominiumService.condominium_common_area_reservationId.delete({ reservationId: id })

            dispatch(
                fetchCondominiumCommonAreaReservations({
                    commonAreaId: commonAreaID
                })
            )

            toast.success(
                'Reserva excluída com sucesso!',
                {
                    position: 'bottom-left',
                    duration: 10000
                }
            )

            return response.data
        } catch (error: any) {
          toast.error(
              'Não foi possível excluir a reserva. Por favor, tente novamente.',
              {
                  position: 'bottom-left',
                  duration: 10000
              }
          )
        }
    }
)

export const appCalendarSlice = createSlice({
    name: 'appCalendar',
    initialState: {
        events: [],
        selectedEvent: null
    },
    reducers: {
        handleSelectEvent: (state, action) => {
            state.selectedEvent = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchCondominiumCommonAreaReservations.fulfilled, (state, action) => {
            state.events = action.payload
        })
    }
})
export const { handleSelectEvent } = appCalendarSlice.actions

export default appCalendarSlice.reducer
