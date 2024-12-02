import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import Box from '@mui/material/Box'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import { NotificationService } from 'src/services/notificationService'

type NotificationContentProps = {
    notificationId: string
}

function NotificationContent({ notificationId }: NotificationContentProps) {
    const notificationQuery = useQuery({
        queryKey: ['notification', notificationId],
        queryFn: () => NotificationService.notificationId.get({ notificationId: notificationId }),
        select: response => response.data
    })

    const notificationContentQuery = useQuery({
        queryKey: ['notificationContent', notificationId],
        queryFn: () =>
            NotificationService.notification_content_by_notificationId.get({ notificationId: notificationId }),
        select: response => response.data.results[0]
    })

    const notificationReceiverQuery = useQuery({
        queryKey: ['notificationReceiver', notificationId],
        queryFn: () =>
            NotificationService.notification_receiver_by_notificationId.get({ notificationId: notificationId }),
        select: response => response.data.results
    })

    return (
        <Box sx={{ display: 'grid', gap: 4 }}>
            <Card sx={{ p: 8 }}>
                <CardHeader
                    title={
                        <>
                            <Typography variant='h5' component='h2'>
                                {notificationQuery.data?.subject}
                            </Typography>
                            <Divider />
                        </>
                    }
                ></CardHeader>
                <CardContent>
                    <div
                        style={{ textAlign: 'justify', fontSize: '14px' }}
                        dangerouslySetInnerHTML={{ __html: notificationContentQuery.data?.content || '' }}
                    />
                </CardContent>
                <Typography sx={{ mb: 3, mr: 5, fontSize: '12px', textAlign: 'end' }}>
                    Enviado dia:
                    {' ' +
                        new Date(notificationContentQuery.data?.created_at ?? '').toLocaleDateString() +
                        ' ás ' +
                        new Date(notificationContentQuery.data?.created_at ?? '').toLocaleTimeString()}
                </Typography>
            </Card>
            <Card sx={{ p: 10 }}>
                <Table
                    title='Buscar Destinatário'
                    data={notificationReceiverQuery.data ?? []}
                    searchField={['value_contact_information_receiver', 'person_receiver_name']}
                    noRowsMessage='Esta notificação não possui destinatários cadastrados.'
                    noRowsFilterMessage='Nenhum destinatário encontrado.'
                >
                    <TableCell align='left' header='Nome' field='person_receiver_name' />
                    <TableCell align='left' header='E-mail' field='value_contact_information_receiver' />
                    <TableCell align='left' formatType='relativeAgoTime' header='Data de Envio' field='sent_at' />
                    <TableCell
                        align='left'
                        formatType='relativeAgoTime'
                        header='Primeira Visualização'
                        field='read_first_at'
                    />
                    <TableCell align='left' formatType='relativeAgoTime' header='Última Visualização' field='read_at' />
                </Table>
            </Card>
        </Box>
    )
}

export default NotificationContent
