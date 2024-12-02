import SelectField from '@core/components/inputs/SelectField'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'


import formatter from '@core/utils/formatter'
import { ExpenseItemType } from '@typesApiMapping/apps/financial/expenseTypes'
import moment from 'moment'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ExpenseFormat, RecurrenceLabels, RecurrenceOptions, RecurrenceTypes } from '../../../enums'
import type { ExpenseSchemaType } from '../../../NewExpense'

type ExpensePaymentDataFormProps = {
    format: ExpenseFormat
    items: ExpenseItemType[] | [] | undefined
    launch_date: Date
    due_date: Date
    amount: number
}

export default function ExpensePaymentDataForm({ format, launch_date, items, due_date }: ExpensePaymentDataFormProps) {
    const form = useFormContext<ExpenseSchemaType>()

    const recurrenceTypeMultipliers = {
        [RecurrenceTypes.monthly]: 1,
        [RecurrenceTypes.bimonthly]: 2,
        [RecurrenceTypes.quarterly]: 3,
        [RecurrenceTypes.semiannual]: 6,
        [RecurrenceTypes.annual]: 12
    }
    const currentRecurrenceMultiplier = recurrenceTypeMultipliers[form.watch('recurrence_type') as RecurrenceTypes] || 1

    const competenceCount = form.watch('recurrence_value') || 1

    useEffect(() => {
      if (format === ExpenseFormat.unique) {
        form.setValue('recurrence_value', 1)
        form.setValue('recurrence_type', RecurrenceTypes.monthly)
      }

    }), [format]

    // Items array should not be empty here or undefined here
    if (!items || items.length === 0) {
        return null
    }



    const amount = (items as ExpenseItemType[]).reduce((acc, item) => acc + item.amount, 0) * 100

    form.setValue('amount', amount)
    const recurrence = form.watch('recurrence_value')

    const competence = moment(launch_date).format('MM/YYYY')

    const resume = Array.from({ length: competenceCount }, (_, index) => ({
        id: `${index}`,
        competence: ExpenseFormat.recurrent === format ? moment(competence, 'MM/YYYY').add(currentRecurrenceMultiplier * index, 'months').format('MM/YYYY') : competence,
        due_date: moment(due_date)
            .add(index * currentRecurrenceMultiplier, 'months')
            .format('DD/MM/YYYY'),
        description: `Parcela ${index + 1}`,
        value: format === ExpenseFormat.installments ? amount / recurrence : amount
    }))

    const currency = formatter('currency')

    return (
        <Box display='grid' gap='8px'>
            {format !== ExpenseFormat.unique && (
                <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                  <TextField disabled label='Valor' value={currency(amount)} />
                    <SelectField
                        control={form.control}
                        name='recurrence_type'
                        label='Recorrência'
                        defaultValue={RecurrenceTypes.monthly}
                        items={Object.entries(RecurrenceOptions).map(([key, value]) => ({ label: value, value: key }))}
                    />
                    <Controller
                        name='recurrence_value'
                        control={form.control}
                        render={({ field }) => (
                            <TextField
                                label=''
                                {...field}
                                InputProps={{
                                    endAdornment: RecurrenceLabels[form.watch('recurrence_type') as RecurrenceTypes](
                                        field.value
                                    )
                                }}
                            />
                        )}
                    />
                </Box>
            )}
            <Box>
                <Table data={resume} showPageSizeOptions key={resume?.length}>
                    <TableCell field='competence' header='Competência' />
                    <TableCell field='due_date' header='Vencimento' />
                    <TableCell field='description' header='Descrição' />
                    <TableCell field='value' header='Valor' formatType='currency' />
                </Table>
            </Box>
        </Box>
    )
}
