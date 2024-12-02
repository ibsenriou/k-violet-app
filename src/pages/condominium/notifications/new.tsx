import NewNotificationDialog from 'src/views/pages/condominium/notifications/NewNotification'
import { useRouter } from 'next/router'

function NewNotification() {
    const router = useRouter()

    return (
        <NewNotificationDialog
            onCancel={() => router.push('/condominium/notifications')}
            onConfirm={() => router.push('/condominium/notifications')}
        />
    )
}

export default NewNotification
