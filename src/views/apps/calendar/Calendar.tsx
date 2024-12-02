// ** React Import
import { useEffect, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import toast from 'react-hot-toast'
// ** Icons Imports

// ** Types
import { CalendarType } from '@typesApiMapping/apps/calendarTypes'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import useService from 'src/hooks/useService'
import { LookupsService } from 'src/services/lookupsService'
import { LookupTypeOfResidentialType } from '@typesApiMapping/apps/lookups/lookupTypeOfResidentialTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'

const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
        calendar: '',
        guests: [],
        location: '',
        description: ''
    }
}

const Calendar = (props: CalendarType) => {
    // ** Props
    const {
        availableReservationDates: availableDates,

        store,
        dispatch,
        direction,
        updateEvent,
        calendarApi,
        setCalendarApi,
        handleSelectEvent,
        handleAddEventSidebarToggle
    } = props

    // ** Refs
    const calendarRef = useRef()

    useEffect(() => {
        if (calendarApi === null) {
            // @ts-ignore
            setCalendarApi(calendarRef.current.getApi())
        }
    }, [calendarApi, setCalendarApi])

    const { residentials } = useSelector((state: RootState) => state.residentials)
    const { commercials } = useSelector((state: RootState) => state.commercials)
    const { data: typeOfResidential } = useService(LookupsService.lookup_type_of_residential) as {
        data: LookupTypeOfResidentialType[]
    }
    const { data: typeOfCommecial } = useService(LookupsService.lookup_type_of_commercial)

    if (store) {
        // ** calendarOptions(Props)
        let storeEvents: any[] = []
        if (store.events?.length) {
            storeEvents = store.events.map(event => {
                const unit =
                    residentials.find(residential => residential.id === event.fk_uhab_as_reservant) ||
                    commercials.find(commercial => commercial.id === event.fk_uhab_as_reservant)

                let abbreviatedType = ''
                if ((unit as ResidentialType)?.fk_lookup_type_of_residential) {
                    const residentialType = typeOfResidential?.find(
                        type => type.id === (unit as ResidentialType)?.fk_lookup_type_of_residential
                    )
                    abbreviatedType = residentialType?.description.substring(0, 5) + '.'
                }
                if ((unit as CommercialType)?.fk_lookup_type_of_commercial) {
                    const commercialType = typeOfCommecial?.find(
                        type => type.id === (unit as CommercialType)?.fk_lookup_type_of_commercial
                    )
                    abbreviatedType = commercialType?.description.substring(0, 5) + '.'
                }
                return {
                    ...event,
                    start: event.reservation_date,
                    allDay: true,
                    title: event.fk_uhab_as_reservant ? `${abbreviatedType} ${unit?.name}` : 'ERROR42'
                }
            })
        }

        const calendarOptions = {
            events: store.events.length ? storeEvents : [],
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                start: 'sidebarToggle, prev, next, title',
                end: 'dayGridMonth'
            },
            locale: 'pt-br',
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                list: 'Lista'
            },

            /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
            editable: false,

            /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
            eventResizableFromStart: false,

            /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
            dragScroll: false,

            /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
            dayMaxEvents: 2,

            /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
            navLinks: false,

            eventClassNames() {
                return [`bg-secondary`]
            },

            eventClick({ event: clickedEvent }: any) {
                // If event date is in the past then return
                const clickedEventDate = new Date(clickedEvent.start)
                const today = new Date()
                if (clickedEventDate < today) {
                    return
                }
                dispatch(handleSelectEvent(clickedEvent))
                handleAddEventSidebarToggle()

                // * Only grab required field otherwise it goes in infinity loop
                // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
                // event.value = grabEventDataFromEventApi(clickedEvent)

                // isAddNewEventSidebarActive.value = true
            },

            dateClick(info: any) {
                const ev = { ...blankEvent }

                if (availableDates && availableDates.length > 0) {
                    const selectedDate = info.dateStr
                    const dateToCompare = new Date(selectedDate.replace(/-/g, '/'))
                    const isAvailable = availableDates.find(
                        date => date.toDateString() === dateToCompare.toDateString()
                    )
                    if (!isAvailable) {
                        return
                    }
                }
                ev.start = info.date
                ev.end = info.date
                ev.allDay = true

                // @ts-ignore
                dispatch(handleSelectEvent(ev))
                handleAddEventSidebarToggle()
            },

            /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
            eventDrop({ event: droppedEvent }: any) {
                dispatch(updateEvent(droppedEvent))
            },

            /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
            eventResize({ event: resizedEvent }: any) {
                dispatch(updateEvent(resizedEvent))
            },

            ref: calendarRef,

            direction,

            // ** Custom Style for disabled dates
            datesSet() {
                const dates = document.querySelectorAll('.fc-day:not(.fc-col-header-cell')
                dates.forEach((date: any) => {
                    const dateToCompare = new Date(String(date.dataset.date).replace(/-/g, '/'))
                    const isAvailable = availableDates.find(
                        date => date.toDateString() === dateToCompare.toDateString()
                    )
                    if (!isAvailable) {
                        // ** Add fc-day-disabled class to disabled dates
                        date.classList.add('fc-day-disabled')
                    }
                })
            }
        }

        // @ts-ignore
        return <FullCalendar {...calendarOptions} />
    } else {
        return null
    }
}

export default Calendar
