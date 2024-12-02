import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export enum DeliveryMethod {
    EMAIL = 1,
    SMS = 2
}

export type NotificationType = HomespaceBaseModel & {
    fk_uhab: string
    fk_condominium: string
    fk_person_sender: string
    fk_person_contact_information_sender: string
    fk_lookup_type_of_notification: string
    delivery_method: DeliveryMethod
    sent_at: string
    subject: string
}
