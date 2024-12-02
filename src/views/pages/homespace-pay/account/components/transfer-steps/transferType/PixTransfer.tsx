import SelectField from '@core/components/inputs/SelectField'
import TextField from '@core/components/inputs/TextField'
import MuiTextField from '@mui/material/TextField'
import AdapterMoment from '@mui/lab/AdapterMoment'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Box from '@mui/material/Box'
import { Controller, useFormContext } from 'react-hook-form'
import moment from 'moment'

export default function PixTransfer() {
    const {
        control,
        formState: { errors }
    } = useFormContext()
    return (
        <Box display='grid' gap={4}>
            <TextField
                control={control}
                name='value'
                label='Valor'
                rules={{ required: 'Campo obrigatório' }}
                error={errors.value}
            />
            <SelectField
                control={control}
                name='pixAddressKeyType'
                label='Tipo de chave'
                items={[
                    { value: 'CPF', label: 'CPF' },
                    { value: 'CNPJ', label: 'CNPJ' },
                    { value: 'EMAIL', label: 'EMAIL' },
                    { value: 'TELEFONE', label: 'TELEFONE' }
                ]}
            />
            <TextField
                control={control}
                name='pixAddressKey'
                label='Chave Pix'
                rules={{ required: 'Campo obrigatório' }}
                error={errors.pixAddressKey}
            />
            <TextField control={control} name='description' label='Descrição' />
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                    control={control}
                    name='dueDate'
                    defaultValue={moment()}
                    render={({ field }) => (
                        <DatePicker
                            label='Data para Agendamento'
                            value={moment(field.value)}
                            onChange={newValue => field.onChange(newValue?.toISOString())}
                            renderInput={params => <MuiTextField {...params} />}
                            minDate={moment()}
                        />
                    )}
                />
            </LocalizationProvider>
        </Box>
    )
}
