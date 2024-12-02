// ** React Imports
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from '@core/hooks/useSettings'

// ** Types
import { RootState, useAppDispatch } from 'src/store'

// ** FullCalendar & App Components Imports
import CalendarWrapper from '@core/styles/libs/fullcalendar'
import Calendar from 'src/views/apps/calendar/Calendar'
import CommonAreaReservationActionDialog from 'src/views/apps/calendar/CommonAreaReservationActionDialog'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'

// ** Actions
import {
  addReservation,
  deleteReservation,
  fetchCondominiumCommonAreaReservations,
  handleSelectEvent,
  updateReservation
} from 'src/store/apps/calendar'

import { fetchData as fetchCommercials } from 'src/store/apps/condominium/commercials'
import { fetchData as fetchCommonAreaDetail } from 'src/store/apps/condominium/condominium-common-area-detail'
import { fetchData as fetchResidentials } from 'src/store/apps/condominium/residentials'

// ** Third Party Styles Imports
import FallbackSpinner from '@core/components/spinner'
import { UhabType } from '@typesApiMapping/apps/condominium/uhabTypes'
import { useRouter } from 'next/router'
import 'react-datepicker/dist/react-datepicker.css'
import { usePermission } from 'src/context/PermissionContext'

const CondominiumCommonAreaReservation = () => {
    // ** States
    const [calendarApi, setCalendarApi] = useState<null | any>(null)
    const [addReservationDialogOpen, setAddReservationDialogOpen] = useState<boolean>(false)

    // ** Hooks
    const dispatch = useAppDispatch()
    const { settings } = useSettings()
    const permission = usePermission('condominium.common_area')

    // ** Store
    const store = useSelector((state: RootState) => state.calendar)
    const residentials = useSelector((state: RootState) => state.residentials.residentials)
    const commercials = useSelector((state: RootState) => state.commercials.commercials)
    const commercialsWhereUserHasRenterRole = useSelector(
        (state: RootState) => state.commercials.commercialsWhereUserHasRenterRole
    )
    const residentialsWhereUserHasResidentRole = useSelector(
        (state: RootState) => state.residentials.residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator
    )
    const commonAreaDetail = useSelector((state: RootState) => state.condominiumCommonAreaDetail.commonArea)
    const commonAreaWorkingWeekDays = commonAreaDetail?.working_week_days

    const router = useRouter()

    useEffect(() => {
        const { id } = router.query as { id: string }

        dispatch(fetchCondominiumCommonAreaReservations({ commonAreaId: id }))
        dispatch(fetchResidentials(''))
        dispatch(fetchCommercials(''))
        dispatch(fetchCommonAreaDetail({ id }))
    }, [dispatch, router.query])

    // ** Vars
    const { skin, direction } = settings
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    const ninetyDaysArrayStartingToday = useMemo(() => {
        const datesArray: any[] = []
        const startDate = new Date()
        if (!commonAreaWorkingWeekDays) {
            return datesArray
        }
        for (let i = 0; i < 90; i++) {
            // Checks if weekday is available in commomAreaWorkingWeekDays before pushing to array
            // The representation of the weekdays is a 7 digit binary string from sunday to saturday where 0 is false and 1 is true
            // Example: 0110000 means that the working days are monday and tuesday
            if (commonAreaWorkingWeekDays[startDate.getDay()] === '1') {
                datesArray.push(new Date(startDate))
            }
            startDate.setDate(startDate.getDate() + 1)
        }

        return datesArray
    }, [commonAreaWorkingWeekDays])

    const availableReservationDates = ninetyDaysArrayStartingToday

    const handleAddReservationDialogToggle = () => setAddReservationDialogOpen(!addReservationDialogOpen)

    const units = useMemo(() => {
        return (residentials as UhabType[]).concat(commercials as UhabType[]).filter(unit => {
            return (
                permission.can('reservation:create', { fk_uhab_as_reservant: unit.id }) ||
                permission.can('reservation:update', { fk_uhab_as_reservant: unit.id })
            )
        })
    }, [residentials, commercials, permission])

    if (
        !residentials ||
        !commercials ||
        !residentialsWhereUserHasResidentRole ||
        !commercialsWhereUserHasRenterRole ||
        !commonAreaDetail ||
        !router.isReady
    ) {
        return <FallbackSpinner />
    } else {
        if (commonAreaDetail.id !== router.query.id) {
            return <FallbackSpinner />
        } else {
            return (
                <CalendarWrapper
                    className='app-calendar'
                    sx={{
                        boxShadow: skin === 'bordered' ? 0 : 6,
                        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
                    }}
                    position='absolute'
                >
                    <SidebarLeft
                        store={store}
                        condominiumCommonAreaName={commonAreaDetail.name}
                        mdAbove={mdAbove}
                        dispatch={dispatch}
                        handleSelectEvent={handleSelectEvent}
                        handleAddEventSidebarToggle={handleAddReservationDialogToggle}
                    />
                    <Box
                        sx={{
                            padding: 5,
                            flexGrow: 1,
                            borderRadius: 1,
                            paddingBottom: 0,
                            boxShadow: 'none',
                            backgroundColor: 'background.paper',
                            ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
                        }}
                    >
                        <Calendar
                            store={store}
                            dispatch={dispatch}
                            direction={direction}
                            updateEvent={updateReservation}
                            calendarApi={calendarApi}
                            setCalendarApi={setCalendarApi}
                            handleSelectEvent={handleSelectEvent}
                            handleAddEventSidebarToggle={handleAddReservationDialogToggle}
                            availableReservationDates={availableReservationDates}
                        />
                    </Box>

                    <CommonAreaReservationActionDialog
                        store={store}
                        units={units}
                        selectedCondominiumCommonAreaName={commonAreaDetail.name}
                        dispatch={dispatch}
                        addEvent={addReservation}
                        updateEvent={updateReservation}
                        deleteEvent={deleteReservation}
                        calendarApi={calendarApi}
                        handleSelectEvent={handleSelectEvent}
                        addEventSidebarOpen={addReservationDialogOpen}
                        handleAddEventSidebarToggle={handleAddReservationDialogToggle}
                        availableReservationDates={availableReservationDates}
                    />
                </CalendarWrapper>
            )
        }
    }
}

CondominiumCommonAreaReservation.acl = {
    action: 'read',
    subject: 'condominium-common-areas-page--reservations'
}

export default CondominiumCommonAreaReservation
