import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import { useQuery } from '@tanstack/react-query'
import { NotificationService } from 'src/services/notificationService'
import { NotificationType } from '@typesApiMapping/apps/notifications/notificationTypes'

type NotificationListProps = {
    onNotificationSelect: (row: NotificationType) => void
    onNewNotification: () => void
}

function NotificationList({ onNotificationSelect, onNewNotification }: NotificationListProps) {
    const notificationQuery = useQuery({
        queryKey: ['notifications'],
        queryFn: () => NotificationService.notifications.get(),
        select: response =>
            response.data.results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    })

    const notificationList = notificationQuery.data

    return (
        <Table
            searchField={['subject']}
            topRightActionCallback={onNewNotification}
            topRightActionLabel='Novo'
            title='Buscar Comunicado'
            data={notificationList ?? []}
            onRowClick={row => onNotificationSelect(row as NotificationType)}
        >
            <TableCell align='left' header='Assunto' field='subject' />
            <TableCell align='center' header='Destinatários' field='quantity_of_receivers' />
            <TableCell align='center' header='Enviados' field='quantity_of_sent' />
            <TableCell align='center' header='Lidos' field='quantity_of_readed' />
            <TableCell align='right' formatType='relativeAgoTime' header='Data de Envio' field='created_at' />
        </Table>
    )
}

export default NotificationList
