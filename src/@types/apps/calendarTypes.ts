// ** Types
import { Dispatch } from 'redux'

// ** Theme Type Import
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { ThemeColor } from 'src/@core/layouts/types'

export type CalendarFiltersType = 'Family' | 'Business'

export type EventDateType = Date | null | undefined

export type CalendarColors = {
    Family: ThemeColor
    Business: ThemeColor
}

export type EventType = {
    url: string
    id: string
    title: string
    residencial_reservante_id: string
    allDay: boolean
    end: Date | string
    start: Date | string
    extendedProps: {
        residencial_reservante_id?: string
        periodo_da_reserva?: number
        location?: string
        calendar?: string
        description?: string
        guests?: string[] | string | undefined
    }
}

export type AddEventType = {
    url: string
    title: string
    residencial_reservante_id: string
    periodo_da_reserva: number
    display: string
    allDay: boolean
    end: Date | string
    start: Date | string
    extendedProps: {
        calendar: string
        description: string | undefined
        guests: string[] | string | undefined
    }
}

export type EventStateType = {
    url: string
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
    selectedCalendars: CalendarFiltersType[] | string[]
}

export type CalendarType = {
    calendarApi: any
    dispatch: Dispatch<any>
    store: CalendarStoreType
    direction: 'ltr' | 'rtl'
    calendarsColor: CalendarColors
    setCalendarApi: (val: any) => void
    handleLeftSidebarToggle: () => void
    updateEvent: (event: EventType) => void
    handleAddEventSidebarToggle: () => void
    handleSelectEvent: (event: EventType) => void

    availableDates: Date[]
}

export type SidebarLeftType = {
    mdAbove: boolean
    dispatch: Dispatch<any>
    leftSidebarWidth: number
    leftSidebarOpen: boolean
    store: CalendarStoreType
    calendarsColor: CalendarColors
    handleLeftSidebarToggle: () => void
    handleAddEventSidebarToggle: () => void
    handleAllCalendars: (val: boolean) => void
    handleSelectEvent: (event: null | EventType) => void
    handleCalendarsUpdate: (val: CalendarFiltersType) => void

    areaComumName?: string
}

export type AddEventSidebarType = {
    calendarApi: any
    drawerWidth: number
    dispatch: Dispatch<any>
    store: CalendarStoreType
    addEventSidebarOpen: boolean
    deleteEvent: (id: string) => void
    addEvent: (event: AddEventType) => void
    updateEvent: (event: EventType) => void
    handleAddEventSidebarToggle: () => void
    handleSelectEvent: (event: null | EventType) => void

    residenciais?: ResidentialType[]
    areaComumName?: string

    availableDates: Date[]
}
