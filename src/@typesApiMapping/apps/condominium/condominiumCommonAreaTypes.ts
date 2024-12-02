import { UhabType } from './uhabTypes'

export type CondominiumCommonAreaType = UhabType & {
    capacity_of_people: number
    does_it_requires_reservation: boolean
    does_it_allows_guests: boolean
    does_it_have_usage_fee: boolean
    does_it_allows_reservation_to_defaulters: boolean
    does_it_have_entry_checklist: boolean
    does_it_have_exit_checklist: boolean
    working_week_days: string
    fk_condominium_common_area_utilization_fee_history: string | null
    have_any_reservation_period: boolean
    have_any_reservation_for_future: boolean
}
