import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumCommonAreaReservationType = HomespaceBaseModel & {
    reservation_date: string
    simple_guest_list: string
    is_reservation_approved_by_syndicator: boolean
    is_this_a_blockation_reservation: boolean
    fk_condominium_common_area: string
    fk_person_as_reservant: string
    fk_uhab_as_reservant: string
    fk_common_area_reservation_period: string
    fks_natural_person_complete_guest_list: string[]
}
