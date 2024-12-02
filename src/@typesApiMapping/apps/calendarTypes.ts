// ** Types
import { Dispatch } from 'redux'

// ** Theme Type Import
import { ThemeColor } from '@core/layouts/types'

// ** Types Imports
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { UhabType } from './condominium/uhabTypes'

export type CalendarFiltersType = 'Family' | 'Business'

export type EventDateType = Date | null | undefined

export type CalendarColors = {
    Family: ThemeColor
    Business: ThemeColor
}

export type EventType = {
    id: string
    title?: string
    fk_uhab_as_reservant: string
    fk_common_area_reservation_period: string
    fk_condominium_common_area: string
    reservation_date: Date | string
    allDay: boolean
    end: Date | string
    start: Date | string
    extendedProps?: {
        created_by: string
        fk_uhab_as_reservant?: string
        fk_common_area_reservation_period?: string
        fk_condominium_common_area?: string
    }
}

export type AddEventType = {
    fk_condominium_common_area: string
    fk_uhab_as_reservant: string
    fk_common_area_reservation_period: string
    reservation_date: Date | string
    allDay: boolean
    end: Date | string
    start: Date | string
}

export type EventStateType = {
    title: string
    allDay: boolean
    guests: string[]
    description: string
    endDate: Date | string
    startDate: Date | string
    calendar: CalendarFiltersType | string
}

export type CalendarStoreType = {
    events: EventType[]
    selectedEvent: null | EventType
}

export type CalendarType = {
    calendarApi: any
    dispatch: Dispatch<any>
    store: CalendarStoreType
    direction: 'ltr' | 'rtl'
    setCalendarApi: (val: any) => void
    updateEvent: (event: EventType) => void
    handleAddEventSidebarToggle: () => void
    handleSelectEvent: (event: EventType) => void

    availableReservationDates: Date[]
}

export type SidebarLeftType = {
    mdAbove: boolean
    dispatch: Dispatch<any>
    store: CalendarStoreType
    handleAddEventSidebarToggle: () => void
    handleSelectEvent: (event: null | EventType) => void

    condominiumCommonAreaName?: string
}

export type AddEventSidebarType = {
    calendarApi: any
    dispatch: Dispatch<any>
    store: CalendarStoreType
    addEventSidebarOpen: boolean
    deleteEvent: (id: string) => void
    addEvent: (event: AddEventType) => void
    updateEvent: (event: EventType) => void
    handleAddEventSidebarToggle: () => void
    handleSelectEvent: (event: null | EventType) => void

    units?: UhabType[]
    selectedCondominiumCommonAreaName?: string

    availableReservationDates: Date[]
}
