import NotificationContent from 'src/views/pages/condominium/notifications/NotificationContent'
import { useRouter } from 'next/router'

function NotificationItem() {
    const router = useRouter()
    const id = router.query.id as string

    return <NotificationContent notificationId={id} />
}

export default NotificationItem
