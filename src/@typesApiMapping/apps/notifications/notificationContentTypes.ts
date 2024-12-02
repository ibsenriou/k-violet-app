import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

type NotificationContentType = HomespaceBaseModel & {
    fk_notification: string
    content: string | null
}

export default NotificationContentType
