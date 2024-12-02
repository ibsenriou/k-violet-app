import { HomespaceBaseModel } from "../core/homeSpaceBaseModelTypes"

export type CondominiumCalendarEventType = HomespaceBaseModel & {
    title: string
    start: string
    description: string
    end: string
    specific_fields: {} // TODO: Add specific fields mapping definition here
    event_type: 'meetingcalendarevent' | 'movingcalendarevent' | 'repaircalendarevent'
    allDay: boolean
    extendedProps: {
        calendar: 'meetingcalendarevent' | 'movingcalendarevent' | 'repaircalendarevent'
    }
}
