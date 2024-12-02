// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'


// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { CalendarColors, CalendarFiltersType } from 'src/@types/apps/condominiumCalendarEventAgendaTypes'

// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/fullCalendar/Calendar'
import SidebarLeft from 'src/views/apps/fullCalendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from 'src/views/apps/fullCalendar/AddEventSidebar'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'

// ** CalendarColors
const calendarsColor: CalendarColors = {
  meetingcalendarevent: 'success',
  movingcalendarevent: 'primary',
  repaircalendarevent: 'warning'
}

const AppCalendar = () => {

  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)

  const [selectedEvent, setSelectedEvent] = useState<
    null | {
      id: string
      title: string
      start: string
      end: string
      allDay: boolean
      description: string
      extendedProps: { calendar: string }
    }
  >(null)

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event)
  }

  const eventQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => {
      return CondominiumService.condominium_calendar_event.get().then(response => response.data)
    },
    select: data => data.results,
    staleTime: 1000 * 60 * 5
  })

  // Temporary copy the eventsQueryData and pass the event_type to the structure of the calendar   extendedProps: {calendar: '', .. } to make it work
  const events = eventQuery.data?.map((event) => {
    return {
      id: event.id,
      description: event.description || '',
      title: event.title,
      start: event.start,
      end: event.end,
      event_type: event.event_type,
      allDay: event.allDay,
      created_at: event.created_at,
      updated_at: event.updated_at,
      deactivated_at: event.deactivated_at,
      created_by: event.created_by,
      updated_by: event.updated_by,
      deactivated_by: event.deactivated_by,
      fk_condominium: event.fk_condominium,
      created_by_name: event.created_by_name,
      specific_fields: {},
      extendedProps: {
        calendar: event.event_type
      }
    }
  }
  )

  const [selectedCalendars, setSelectedCalendars] = useState<CalendarFiltersType[]>([
    'meetingcalendarevent',
    'movingcalendarevent',
    'repaircalendarevent'
  ])

  const handleCalendarsUpdate = (calendar: CalendarFiltersType) => {
    setSelectedCalendars(prev => {
      if (prev.includes(calendar)) {
        return prev.filter(item => item !== calendar)
      } else {
        return [...prev, calendar]
      }
    })
  }

  const handleAllCalendars = () => {
    if (selectedCalendars.length === Object.keys(calendarsColor).length) {
      setSelectedCalendars([])
    } else {
      setSelectedCalendars(Object.keys(calendarsColor) as CalendarFiltersType[])
    }
  }


  // Show only events that the calendar is selected
  const filteredEvents = events?.filter(event => selectedCalendars.includes(event.extendedProps.calendar)) || []


  const { settings } = useSettings()

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        mdAbove={mdAbove}
        leftSidebarWidth={leftSidebarWidth}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={handleAllCalendars}
        handleCalendarsUpdate={handleCalendarsUpdate}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}

        selectedCalendars={selectedCalendars}
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
          events={filteredEvents}
          direction={direction}
          calendarsColor={calendarsColor}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        />
      </Box>
      <AddEventSidebar
        selectedEvent={selectedEvent}
        handleSelectEvent={handleSelectEvent}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
    </CalendarWrapper>
  )
}

export default AppCalendar
