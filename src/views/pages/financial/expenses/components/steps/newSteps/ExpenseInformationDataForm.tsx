import SelectField from '@core/components/inputs/SelectField'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { CondominiumService } from 'src/services/condominiumService'
import type { ExpenseInformationDataSchemaType } from '../../../NewExpense'
import { ExpenseFormat, ExpenseTypesOptions } from '../../../enums'
import moment from 'moment'

export default function ExpenseInformationDataForm() {
    const form = useFormContext<ExpenseInformationDataSchemaType>()

    const supplierQuery = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            return CondominiumService.suppliers.get().then(response => response.data)
        },
        staleTime: 1000 * 60 * 5
    })

    return (
        <Box display='grid' gap='16px'>
            <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap='16px'>
                <SelectField
                    label='Fornecedor'
                    name='fk_supplier'
                    control={form.control}
                    keyLabel='label'
                    keyValue='value'
                    error={form.formState.errors.fk_supplier}
                    items={
                        supplierQuery.data?.results?.map(item => ({
                            label: item.name,
                            value: item.id
                        })) || []
                    }
                />
            </Box>
            <Box display='grid' gridTemplateColumns='repeat(2, 1fr)' gap='16px'>
                <Controller
                    name='description'
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label='Descrição'
                            fullWidth
                            helperText={form.formState.errors.description?.message}
                            error={!!form.formState.errors.description}
                        />
                    )}
                />
                <SelectField
                    label='Tipo de Despesa'
                    name='expense_type'
                    control={form.control}
                    keyLabel='label'
                    keyValue='value'
                    error={form.formState.errors.expense_type}
                    items={Object.entries(ExpenseTypesOptions).map(([key, value]) => ({
                        label: value,
                        value: key
                    }))}
                />
                <Controller
                    name='launch_date'
                    control={form.control}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                onChange={date => field.onChange(date)}
                                value={moment(field.value)}
                                label='Data de Lançamento'
                                views={['month', 'year', 'day']}
                                format='DD/MM/YYYY'
                                slotProps={{
                                    textField: {
                                        error: !!form.formState.errors.launch_date,
                                        helperText: form.formState.errors.launch_date?.message
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    )}
                />

                <Controller
                    name='due_date'
                    control={form.control}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                onChange={date => field.onChange(date)}
                                value={moment(field.value)}
                                label='Data de Vencimento'
                                views={['month', 'year', 'day']}
                                format='DD/MM/YYYY'
                                slotProps={{
                                    textField: {
                                        error: !!form.formState.errors.due_date,
                                        helperText: form.formState.errors.due_date?.message
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    )}
                />
            </Box>
            <Box display='grid' gap='16px'>
                <FormGroup>
                    <FormLabel id='demo-form-control-label-placement'>Formato da cobrança</FormLabel>
                    <Controller
                        name='expense_format'
                        control={form.control}
                        defaultValue={ExpenseFormat.unique}
                        render={({ field }) => (
                            <RadioGroup
                                aria-labelledby='demo-controlled-radio-buttons-group'
                                name='controlled-radio-buttons-group'
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                row
                            >
                                <FormControlLabel value={ExpenseFormat.unique} control={<Radio />} label='Única' />
                                <FormControlLabel
                                    value={ExpenseFormat.recurrent}
                                    control={<Radio />}
                                    label='Recorrente'
                                />
                                <FormControlLabel
                                    value={ExpenseFormat.installments}
                                    control={<Radio />}
                                    label='Parcelado'
                                />
                            </RadioGroup>
                        )}
                    />
                </FormGroup>
            </Box>
        </Box>
    )
}
