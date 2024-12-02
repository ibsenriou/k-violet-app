import { createUrl } from './Url'

import { NotificationType } from '@typesApiMapping/apps/notifications/notificationTypes'
import NotificationContentType from '@typesApiMapping/apps/notifications/notificationContentTypes'
import NotificationReceiverType from '@typesApiMapping/apps/notifications/notificationReceiverTypes'

export const NotificationService = {
    notifications: createUrl<null, NotificationType[]>('/notifications/notification/'),
    notificationId: createUrl<{ notificationId: string }, NotificationType>(
        '/notifications/notification/:notificationId/'
    ),
    notification_content_by_notificationId: createUrl<{ notificationId: string }, NotificationContentType[]>(
        '/notifications/notification-content?fk_notification=:notificationId'
    ),
    notification_receiver_by_notificationId: createUrl<{ notificationId: string }, NotificationReceiverType[]>(
        '/notifications/notification-receiver?fk_notification=:notificationId'
    ),
    send_email: createUrl<null, null>('/notifications/send-email/')
}
