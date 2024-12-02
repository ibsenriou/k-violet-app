import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import { ExpenseTypesOptions } from '../../../enums'
import formatter from '@core/utils/formatter'

type ExpenseInformationDataFormProps = {
    expense: ExpenseType
}

const competence = formatter('competence')
const date = formatter('date')

export default function ExpenseInformationDataForm({ expense }: ExpenseInformationDataFormProps) {
    return (
        <Box display='grid' gap='16px'>
            <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap='16px'>
                <TextField label='Fornecedor' value={expense.supplier_name} disabled />
            </Box>
            <Box display='grid' gridTemplateColumns='repeat(2, 1fr)' gap='16px'>
                <TextField label='Descrição' value={expense.description} disabled />
                <TextField label='Tipo de Despesa' value={ExpenseTypesOptions[expense.expense_type_label]} disabled />
                <TextField label='Data de Lançamento' value={date(expense.launch_date)} disabled />
                <TextField label='Data de Vencimento' value={date(expense.due_date)} disabled />
                <TextField label='Competência' value={competence(expense.competence)} disabled />
            </Box>
        </Box>
    )
}
