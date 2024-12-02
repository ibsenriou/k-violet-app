import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useState } from 'react'
import { HomespacePayService } from 'src/services/homespacePayService'

import AdapterMoment from '@mui/lab/AdapterMoment'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { CondominiumService } from 'src/services/condominiumService'
import { UhabType } from '@typesApiMapping/apps/condominium/uhabTypes'
import DownloadCircle from 'mdi-material-ui/DownloadCircle'
import { DataParams } from '@core/components/table/types'

const status_map = {
    RECEIVED: 'Recebido',
    PENDING: 'Pendente',
    OVERDUE: 'Atrasado'
} as any

type PaymentListProps = {
    onClickCreatePayment: () => void
}
export default function PaymentList({ onClickCreatePayment }: PaymentListProps) {
    const [dateFilter, setDateFilter] = useState<{
        start: Date
        end: Date
    }>(() => ({ start: moment().startOf('month').toDate(), end: moment().endOf('month').toDate() }))

    const paymentQuery = useQuery({
        queryKey: ['payments', dateFilter.start.toISOString(), dateFilter.end.toISOString()],
        queryFn: async () => {
            const dateFrom = dateFilter.start.toISOString().split('T')[0]
            const dateTo = dateFilter.end.toISOString().split('T')[0]
            const response = await HomespacePayService.payment.get(null, {
                dueFrom: dateFrom,
                dueTo: dateTo
            })
            return response.data
        }
    })

    const residentialsQuery = useQuery({
        queryKey: ['residentials'],
        queryFn: () => CondominiumService.residential.get(),
        select: data => data?.data?.results as unknown as UhabType[]
    })

    const commercialsQuery = useQuery({
        queryKey: ['commercials'],
        queryFn: () => CondominiumService.commercial.get(),
        select: data => data?.data.results as unknown as UhabType[]
    })

    function downloadBoleto(id: string) {
        fetch(`/api/homespace-pay/payment/${id}/boleto`, {
            method: 'GET'
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'boleto.pdf')
                document.body.appendChild(link)
                link.click()
            })
    }

    const uhab = ([] as UhabType[]).concat(residentialsQuery.data || [], commercialsQuery.data || [])

    return (
        <Card>
            <CardContent>
                <Box>
                    <Typography marginBottom='20px' variant='h5'>
                        Cobranças
                    </Typography>
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label='Vencimento de'
                                value={dateFilter.start}
                                onChange={newValue => setDateFilter({ ...dateFilter, start: newValue as Date })}
                                renderInput={params => <TextField {...params} />}
                            />
                            <DatePicker
                                label='Vencimento até'
                                value={dateFilter.end}
                                onChange={newValue => setDateFilter({ ...dateFilter, end: newValue as Date })}
                                renderInput={params => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Table
                        data={paymentQuery.data || []}
                        topRightActionLabel='Criar Cobrança'
                        topRightActionCallback={onClickCreatePayment}
                        loading={paymentQuery.isLoading}
                    >
                        <TableCell field='dueDate' header='Data de Vencimento' formatType='date' />
                        <TableCell field='description' header='Descrição' />
                        <TableCell field='customer_name' header='Cliente' />
                        <TableCell field='value' header='Valor' formatType='currency' />
                        <TableCell field='netValue' header='Valor Líquido' formatType='currency' />
                        <TableCell
                            field='status'
                            header='Status'
                            valueFormatter={({ value }: any) => status_map[value]}
                        />
                        <TableCell
                            field='referenceId'
                            header='Unidade'
                            valueFormatter={({ value }: any) => {
                                const uhabItem = uhab.find(u => u.id === value)
                                return uhabItem?.name || value
                            }}
                        />
                        <TableCell field='actions' header='Ações'>
                            {({ row }: DataParams<any>) =>
                                row.status === 'RECEIVED' ? null : (
                                    <IconButton
                                        onClick={() => {
                                            downloadBoleto(row.id)
                                        }}
                                    >
                                        <DownloadCircle />
                                    </IconButton>
                                )
                            }
                        </TableCell>
                    </Table>
                </Box>
            </CardContent>
        </Card>
    )
}
