// ** Types
import { CondominiumCalendarEventType } from '@typesApiMapping/apps/condominium/condominiumCalendarEventTypes'

// ** Theme Type Import
import { ThemeColor } from 'src/@core/layouts/types'

export type CalendarFiltersType = 'meetingcalendarevent' | 'movingcalendarevent' | 'repaircalendarevent'
export type EventDateType = Date | null | undefined

export type CalendarColors = {
  meetingcalendarevent: ThemeColor
  movingcalendarevent: ThemeColor
  repaircalendarevent: ThemeColor
}

export type EventType = {
  id: string
  title: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    calendar?: string
    description?: string
  }
}

export type AddEventType = {
  title: string
  display: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    calendar: string
    description: string | undefined
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
  events: CondominiumCalendarEventType[]
  direction: 'ltr' | 'rtl'
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: EventType) => void
}

export type SidebarLeftType = {
  mdAbove: boolean
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleAllCalendars: (val: boolean) => void
  handleSelectEvent: (event: null | EventType) => void
  handleCalendarsUpdate: (val: CalendarFiltersType) => void
  selectedCalendars: CalendarFiltersType[]
}

export type AddEventSidebarType = {
  selectedEvent: null | EventType
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
  handleSelectEvent: (event: null | EventType) => void
}
