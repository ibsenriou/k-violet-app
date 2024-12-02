import SelectField from '@core/components/inputs/SelectField'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import type { Theme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { AccountingService } from 'src/services/accountingService'
import type { InfoDataSchemaType } from '../../NewCollection'
import { CollectionFormat, CollectionOptions } from '../../enums'
import moment from 'moment'
import { Type } from '@typesApiMapping/apps/accounting/accountTypes'

export default function InfoDataForm() {
    const form = useFormContext<InfoDataSchemaType>()

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(response => response.data)
        },
        select: data =>
            data.results
                .filter(i => i.code.startsWith('3.') && i.type == Type.ANALYTIC)
                .map(i => ({
                    ...i,
                    description: i.description
                        .replace('Despesas C/ Materiais de', '')
                        .replace('Despesas C/ Materiais', '')
                        .replace('Despesas C/', '')
                        .trim()
                })),
        staleTime: 1000 * 60 * 5
    })

    return (
        <Box display='grid' gap='16px'>
            <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='16px'>
                <SelectField
                    label='Categoria'
                    name='fk_account'
                    control={form.control}
                    keyLabel='label'
                    keyValue='value'
                    error={form.formState.errors.fk_account}
                    items={
                        accountQuery.data?.map(item => ({
                            label: item.description,
                            value: item.id
                        })) || []
                    }
                />
                <Controller
                    name='competence'
                    control={form.control}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                onChange={date => field.onChange(date)}
                                value={moment(field.value)}
                                label='Competência'
                                views={['month', 'year']}
                                format='MM/YYYY'
                                slotProps={{
                                    textField: {
                                        error: !!form.formState.errors.competence,
                                        helperText: form.formState.errors.competence?.message
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    )}
                />
                <SelectField
                    label='Responsável'
                    name='responsible'
                    control={form.control}
                    error={form.formState.errors.responsible}
                    keyLabel='label'
                    keyValue='value'
                    items={[
                        { label: 'Proprietário', value: 'proprietary' },
                        { label: 'Morador/Locatário', value: 'resident' }
                    ]}
                    helperText={
                        form.watch('responsible') == 'resident'
                            ? 'Caso o morador/locatário não esteja cadastrado, será gerado a cobrança para o proprietário.'
                            : ''
                    }
                />

                <SelectField
                    label='Natureza'
                    name='nature'
                    control={form.control}
                    error={form.formState.errors.nature}
                    keyLabel='label'
                    keyValue='value'
                    items={[
                        { label: 'Ordinário', value: 'ordinary' },
                        { label: 'Extraordinario', value: 'extraordinary' }
                    ]}
                />
                <Controller
                    name='amount'
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value / 100}
                            onChange={e =>
                                field.onChange({ target: { value: Number(e.target.value) * 100 }, name: field.name })
                            }
                            label='Valor'
                            type='number'
                            InputProps={{
                                startAdornment: (
                                    <Typography
                                        variant='body1'
                                        paddingRight='4px'
                                        sx={(theme: Theme) => ({
                                            color: !!form.formState.errors.amount
                                                ? theme.palette.error.main
                                                : theme.palette.text.secondary
                                        })}
                                    >
                                        R$
                                    </Typography>
                                )
                            }}
                            error={!!form.formState.errors.amount}
                            helperText={form.formState.errors.amount?.message}
                        />
                    )}
                />
                <SelectField
                    label='Tipo'
                    name='type'
                    control={form.control}
                    keyLabel='label'
                    keyValue='value'
                    error={form.formState.errors.type}
                    items={
                        Object.entries(CollectionOptions).map(([key, value]) => ({
                            label: value,
                            value: key
                        })) || []
                    }
                />
            </Box>
            <Box display='grid' gap='16px'>
                <Controller
                    name='description'
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label='Descrição'
                            fullWidth
                            multiline
                            minRows={3}
                            helperText={form.formState.errors.description?.message}
                            error={!!form.formState.errors.description}
                        />
                    )}
                />
                <FormGroup>
                    <FormLabel id='demo-form-control-label-placement'>Formato da cobrança</FormLabel>
                    <Controller
                        name='format'
                        control={form.control}
                        defaultValue={CollectionFormat.single}
                        render={({ field }) => (
                            <RadioGroup
                                aria-labelledby='demo-controlled-radio-buttons-group'
                                name='controlled-radio-buttons-group'
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                row
                            >
                                <FormControlLabel value={CollectionFormat.single} control={<Radio />} label='Única' />
                                <FormControlLabel
                                    value={CollectionFormat.recurrent}
                                    control={<Radio />}
                                    label='Recorrente'
                                />
                                <FormControlLabel
                                    value={CollectionFormat.installments}
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
