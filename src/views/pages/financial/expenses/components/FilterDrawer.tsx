import SelectField from '@core/components/inputs/SelectField'
import LoadingButton from '@core/components/loading-button'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { CondominiumService } from 'src/services/condominiumService'
import { ExpenseStatus } from '../enums'

type FilterDrawerProps = {
    onCancel: () => void
    onFilter: (filters: { [key: string]: string }) => void
    filters: { [key: string]: string | undefined }
}
export default function FilterDrawer({ onCancel, onFilter, filters }: FilterDrawerProps) {
    const filterForm = useForm({
        defaultValues: filters
    })

    const suppliersQuery = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            return CondominiumService.suppliers.get().then(response => response.data)
        },
        select: data => data.results,
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
                <SelectField
                    label='Fornecedor'
                    name='fk_supplier'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    onClear={() => filterForm.setValue('fk_supplier', undefined)}
                    items={
                        suppliersQuery.data?.map(item => ({
                            label: item.name,
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
                        name='due_date_from'
                        control={filterForm.control}
                        defaultValue={moment().startOf('month').toISOString()}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Vencimento de'
                                    format='DD/MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />

                    <Controller
                        name='due_date_to'
                        control={filterForm.control}
                        defaultValue={moment().endOf('month').toISOString()}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Vencimento até'
                                    format='DD/MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />
                </Box>

                <Controller
                    name='payment_date'
                    control={filterForm.control}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                {...field}
                                value={field.value ? moment(field.value) : null}
                                onChange={date => field.onChange(date?.toISOString())}
                                label='Pagamento'
                                format='DD/MM/YYYY'
                            />
                        </LocalizationProvider>
                    )}
                />

                <SelectField
                    label='Status'
                    name='status'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        { label: 'Pago', value: ExpenseStatus.paid },
                        { label: 'Pendente', value: ExpenseStatus.pending },
                        { label: 'Vencido', value: ExpenseStatus.overdue },
                        { label: 'Cancelado', value: ExpenseStatus.canceled }
                    ]}
                />
                <SelectField
                    label='Tipo de Despesa'
                    name='expense_type'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        { label: 'Ordinário', value: 'ordinary' },
                        { label: 'Extraordinario', value: 'extraordinary' }
                    ]}
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
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
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
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Competência até'
                                    views={['month', 'year']}
                                    format='MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />
                </Box>
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
