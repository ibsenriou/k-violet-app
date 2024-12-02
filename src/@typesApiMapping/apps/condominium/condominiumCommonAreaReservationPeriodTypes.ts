import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumCommonAreaReservationPeriodType = HomespaceBaseModel & {
    is_full_day: boolean
    start_time: string
    end_time: string
    is_period_active: boolean
    fk_condominium_common_area: string
    have_any_reservation_for_future: boolean
}
