import formatter from '@core/utils/formatter'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

const currency = formatter('currency')
const competence = formatter('competence')
const date = formatter('date')

import { ExpenseStatus, ExpenseStatusOptions } from '../../enums'

type ExpensesRowProps = {
    expense: ExpenseType
    onPayExpense: (expenseId: string) => void
    onViewExpense: (expenseId: string) => void
    onDeleteExpense: (expenseId: string) => void
}
export default function ExpensesRow({ expense, onPayExpense, onViewExpense, onDeleteExpense }: ExpensesRowProps) {
    return (
        <TableRow key={expense.id}>
            <TableCell>{expense.supplier_name}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{`${expense.recurrence_index} de ${expense.recurrence_value}`}</TableCell>
            <TableCell>{competence(expense.competence)}</TableCell>
            <TableCell>{currency(expense.amount)}</TableCell>
            <TableCell>{date(expense.due_date)}</TableCell>
            <TableCell>{date(expense.payment_date)}</TableCell>
            <TableCell>{ExpenseStatusOptions[expense.expense_status_label]}</TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {(expense.expense_status_label === ExpenseStatus.pending ||
                        expense.expense_status_label === ExpenseStatus.overdue) && (
                        <Tooltip title='Pagar despesa' arrow>
                            <IconButton onClick={() => onPayExpense(expense.id)}>
                                <CurrencyUsd fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton onClick={() => onViewExpense(expense.id)}>
                        <EyeOutline fontSize='small' />
                    </IconButton>
                    {(expense.expense_status_label === ExpenseStatus.pending ||
                        expense.expense_status_label === ExpenseStatus.overdue) && (
                        <IconButton onClick={() => onDeleteExpense(expense.id)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    )
}
