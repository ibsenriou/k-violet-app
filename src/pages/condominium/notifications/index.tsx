import NotificationList from 'src/views/pages/condominium/notifications/NotificationList'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

const Notifications = () => {
    const router = useRouter()

    return (
        <Card>
            <NotificationList
                onNotificationSelect={row => router.push(`/condominium/notifications/${row.id}`)}
                onNewNotification={() => router.push('/condominium/notifications/new')}
            />
        </Card>
    )
}

export default Notifications
