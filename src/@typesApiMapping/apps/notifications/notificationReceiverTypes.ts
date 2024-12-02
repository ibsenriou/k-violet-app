import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export enum Status {
    QUEUED = 1,
    PENDING = 2,
    SENT = 3,
    RECEIVED = 4,
    READ = 5
}

type NotificationReceiverType = HomespaceBaseModel & {
    fk_notification: string
    fk_person_receiver: string
    fk_lookup_type_of_contact_information_receiver: string
    value_contact_information_receiver: string
    sent_at: string
    read_first_at: string
    read_at: string
    received_at: string
    status: Status
}

export default NotificationReceiverType
