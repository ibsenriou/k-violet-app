import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import formatter from '@core/utils/formatter'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

export type ExpenseProductsAndServicesDataForm = {
    items: {
        fk_item: string
        amount: number
        quantity: number
        unit_amount: number
        id?: string
        type: 'PRODUCT' | 'SERVICE'
    }[]
}

const currency = formatter("currency")

type ExpenseInformationDataFormProps = {
  expense: ExpenseType
}

export default function ExpenseProductsAndServicesDataForm({ expense }: ExpenseInformationDataFormProps) {
    const items = expense.items

    const resume = items.map(item => ({
      id: item.id,
      item_name: item.item_name,
      quantity: item.quantity,
      amount: item.amount / item.quantity,
      total_amount: item.amount
  }))

    return (
        <Box display='grid' gap={8}>
                <Table data={resume} showPageSizeOptions key={resume?.length}>
                    <TableCell field='item_name' header='Item' minWidth={200}/>
                    <TableCell field='quantity' header='Quantidade' />
                    <TableCell field='amount' header='Valor' formatType='currency' />
                    <TableCell field='total_amount' header='Total' formatType='currency' />
                </Table>
        </Box>
    )
}
