import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumUserOccurrenceType = HomespaceBaseModel & {
    title: string
    description: string
    fk_lookup_type_of_condominium_user_occurrence: string

    created_by_name: string
    lookup_type_of_condominium_user_occurrence: string
    conclusion_date: string | null
    current_status: 'open' | 'in_progress' | 'resolved'

    privacy: 'public' | 'private'
    statuses: CondominiumUserOccurrenceItemStatusType[]
}

export type CondominiumUserOccurrenceItemStatusType = HomespaceBaseModel & {
  previous_status_of_condominium_user_occurrence:  'open' | 'in_progress' | 'resolved'
  current_status_of_condominium_user_occurrence: 'open' | 'in_progress' | 'resolved'
  is_system_generated: boolean
  description: string

}
