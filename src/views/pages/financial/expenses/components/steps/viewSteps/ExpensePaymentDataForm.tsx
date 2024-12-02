import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import formatter from '@core/utils/formatter'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import moment from 'moment'
import { ExpenseFormat, RecurrenceOptions, RecurrenceTypes } from '../../../enums'

type ExpenseInformationDataFormProps = {
    expense: ExpenseType
}

export default function ExpensePaymentDataForm({ expense }: ExpenseInformationDataFormProps) {
    const recurrenceTypeMultipliers = {
        [RecurrenceTypes.monthly]: 1,
        [RecurrenceTypes.bimonthly]: 2,
        [RecurrenceTypes.quarterly]: 3,
        [RecurrenceTypes.semiannual]: 6,
        [RecurrenceTypes.annual]: 12
    }

    const recurrenceMultiplier = recurrenceTypeMultipliers[expense.expense_recurrence_type_label]
    const expenseIsUnique = expense.expense_format_label === ExpenseFormat.unique
    const expenseIsRecurrent = expense.expense_format_label === ExpenseFormat.recurrent

    const currentRecurrence = expense.recurrence_index
    const totalRecurrences = expense.recurrence_value

    const expenseLaunchDate = moment(expense.launch_date)


    const currentExpenseDueDate = moment(expense.due_date)
    const firstRecurrenceDueDate = currentExpenseDueDate.subtract(currentRecurrence * recurrenceMultiplier, 'months')


    const totalExpenseAmount = expenseIsRecurrent ? expense.amount : expense.amount * totalRecurrences

    const resume = Array.from({ length: totalRecurrences }, (_, index) => ({
      id: `${index}`,
      competence: expenseIsRecurrent ? expenseLaunchDate.clone().add(recurrenceMultiplier * index, 'months').format('MM/YYYY') : expenseLaunchDate.format('MM/YYYY'),
      due_date: firstRecurrenceDueDate.clone().add(recurrenceMultiplier * (index + 1), 'months').format('DD/MM/YYYY'),
      description: `Parcela ${index + 1}`,
      value: expenseIsRecurrent ? totalExpenseAmount : totalExpenseAmount / totalRecurrences
    }))

    const currency = formatter('currency')

    return (
        <Box display='grid' gap='8px'>
            {!expenseIsUnique && (
                <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                  <TextField disabled label='Valor' value={currency(totalExpenseAmount)} />
                    <TextField
                        disabled={true}
                        value={RecurrenceOptions[expense.expense_recurrence_type_label]}
                        label='Recorrência'
                    />
                    <TextField disabled={true} value={expense.recurrence_value} label='Parcelas' type='number' />
                </Box>
            )}

            <Box>
                <Table data={resume} showPageSizeOptions key={resume?.length}>
                    <TableCell field='competence' header='Competencia' />
                    <TableCell field='due_date' header='Vencimento' />
                    <TableCell field='description' header='Descrição' />
                    <TableCell field='value' header='Valor' formatType='currency' />
                </Table>
            </Box>
        </Box>
    )
}
