import SelectField from '@core/components/inputs/SelectField'
import LoadingButton from '@core/components/loading-button'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { UserOccurrenceStatus } from '../enums'

type FilterDrawerProps = {
    onCancel: () => void
    onFilter: (filters: { [key: string]: string }) => void
    filters: { [key: string]: string | undefined }
}
export default function FilterDrawer({ onCancel, onFilter, filters }: FilterDrawerProps) {
    const filterForm = useForm({
        defaultValues: filters
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

                <Box
                    style={{
                        display: 'flex',
                        gap: '16px'
                    }}
                >
                    <Controller
                        name='launch_date_from'
                        control={filterForm.control}
                        defaultValue={moment().startOf('month').toISOString()}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Data de Abertura de'
                                    format='DD/MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />

                    <Controller
                        name='launch_date_to'
                        control={filterForm.control}
                        defaultValue={moment().endOf('month').toISOString()}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    {...field}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date?.toISOString())}
                                    label='Data de Abertura até'
                                    format='DD/MM/YYYY'
                                />
                            </LocalizationProvider>
                        )}
                    />
                </Box>

                <SelectField
                    label='Status'
                    name='status'
                    control={filterForm.control}
                    keyLabel='label'
                    keyValue='value'
                    showClear
                    items={[
                        { label: 'Aberto', value: UserOccurrenceStatus.open },
                        { label: 'Em Andamento', value: UserOccurrenceStatus.inProgress },
                        { label: 'Fechado', value: UserOccurrenceStatus.resolved },
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
