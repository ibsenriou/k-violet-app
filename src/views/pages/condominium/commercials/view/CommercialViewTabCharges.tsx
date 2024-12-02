import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from 'src/store'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import { DataParams } from '@core/components/table/types'
import { HomespacePayService } from 'src/services/homespacePayService'
import { useQuery } from '@tanstack/react-query'
import DownloadCircle from 'mdi-material-ui/DownloadCircle'

const status_map = {
    RECEIVED: 'Recebido',
    PENDING: 'Pendente',
    OVERDUE: 'Atrasado'
} as any

const CommercialViewTabCharges = () => {
    const commercialId = useSelector((state: RootState) => state.commercialDetail.data.id)
    const paymentQuery = useQuery({
        queryKey: ['payments', commercialId],
        queryFn: async () => {
            const response = await HomespacePayService.payment.get(null, {
                referenceId: commercialId as string
            })
            return response.data
        }
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

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                title='Faturas'
                data={paymentQuery.data ?? []}
                noRowsMessage='Este residencial não possui faturas.'
                loading={paymentQuery.isLoading}
            >
                <TableCell field='dueDate' header='Data de Vencimento' formatType='date' />
                <TableCell field='description' header='Descrição' />
                <TableCell field='customer_name' header='Cliente' />
                <TableCell field='value' header='Valor' formatType='currency' />
                <TableCell field='status' header='Status' valueFormatter={({ value }: any) => status_map[value]} />
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
        </Card>
    )
}

export default CommercialViewTabCharges
