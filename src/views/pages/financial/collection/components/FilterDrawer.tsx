import SelectField from '@core/components/inputs/SelectField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import { useUhabs } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { AccountingService } from 'src/services/accountingService'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import LoadingButton from '@core/components/loading-button'
import Close from 'mdi-material-ui/Close'
import { useState } from 'react'

type FilterDrawerProps = {
    onCancel: () => void
    onFilter: (filters: { [key: string]: string }) => void
    filters: { [key: string]: string | undefined }
}
export default function FilterDrawer({ onCancel, onFilter, filters }: FilterDrawerProps) {
    const [onFocusUhabField, setOnFocusUhabField] = useState(false)
    const filterForm = useForm({
        defaultValues: filters
    })

    const uhabs = useUhabs()

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(response => response.data)
        },
        select: data =>
            data.results
                .filter(i => i.code.startsWith('4.1.1.2.'))
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
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                padding: '16px'
            }}
        >
            <Box
                style={{
                    minWidth: '400px',
                    maxWidth: '500px',
                    display: 'grid',
                    gap: '16px'
                }}
            >
                <Controller
                    name='fk_uhabs'
                    control={filterForm.control}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            limitTags={3}
                            open={onFocusUhabField}
                            options={uhabs.map(h => h.id)}
                            multiple
                            onFocus={() => setOnFocusUhabField(true)}
                            onBlur={() => setOnFocusUhabField(false)}
                            onChange={(_, data) => field.onChange(data)}
                            value={field.value as unknown as string[]}
                            groupBy={option => uhabs.find(h => h.id == option)?.type || ''}
                            getOptionLabel={option => uhabs.find(h => h.id == option)?.name || ''}
                            clearIcon={<Close />}
                            renderInput={params => <TextField {...params} label='Unidade' />}
                        />
                    )}
                />
                <SelectField
                    label='Categoria'
                    name='fk_account'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    onClear={() => filterForm.setValue('fk_account', undefined)}
                    items={
                        accountQuery.data?.map(item => ({
                            label: item.description,
                            value: item.id
                        })) || []
                    }
                />
                <Box
                    style={{
                        display: 'flex',
                        gap: '16px'
                    }}
                >
                    <Controller
                        name='competence_from'
                        control={filterForm.control}
                        defaultValue={moment().startOf('month').toISOString()}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    value={moment(field.value)}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Competência de'
                                    views={['month', 'year']}
                                    format='MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        name='competence_to'
                        control={filterForm.control}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    onChange={date => field.onChange(date)}
                                    value={moment(field.value)}
                                    label='Competência até'
                                    views={['month', 'year']}
                                    format='MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />
                </Box>
                <SelectField
                    label='Vinculado a Cobrança'
                    name='charge_created'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        {
                            label: 'Sim',
                            value: true
                        },
                        {
                            label: 'Não',
                            value: false
                        }
                    ]}
                />
                <SelectField
                    label='Natureza'
                    name='nature'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        { label: 'Ordinário', value: 'ordinary' },
                        { label: 'Extraordinario', value: 'extraordinary' }
                    ]}
                />
                <SelectField
                    label='Responsável'
                    name='responsible'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        { label: 'Proprietário', value: 'proprietary' },
                        { label: 'Morador/Locatário', value: 'resident' }
                    ]}
                />
            </Box>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <LoadingButton
                    variant='contained'
                    color='primary'
                    onClick={filterForm.handleSubmit(() =>
                        onFilter(filterForm.getValues() as { [key: string]: string })
                    )}
                    loading={false}
                >
                    Filtrar
                </LoadingButton>
                <Button onClick={onCancel}>Cancelar</Button>
            </Box>
        </Box>
    )
}
