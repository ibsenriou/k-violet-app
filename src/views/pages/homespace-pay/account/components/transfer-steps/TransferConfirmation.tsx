import TextField from '@core/components/inputs/TextField'
import AdapterMoment from '@mui/lab/AdapterMoment'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Box from '@mui/material/Box'
import moment from 'moment'
import MuiTextField from '@mui/material/TextField'
import { useFormContext } from 'react-hook-form'

type TransferConfirmationForm = {
    pixAddressKeyType: string
    pixAddressKey: string
    description: string
    dueDate: string
    value: string
}
export default function TransferConfirmation() {
    const { watch } = useFormContext<TransferConfirmationForm>()

    return (
        <Box display='grid' gap={4}>
            <TextField value={watch('value')} label='Valor' disabled />
            <TextField value={watch('pixAddressKeyType')} label='Tipo de chave' disabled />
            <TextField value={watch('pixAddressKey')} label='Chave Pix' disabled />
            <TextField value={watch('description')} label='Descrição' disabled />
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    onChange={() => {}}
                    label='Data para Agendamento'
                    value={moment(watch('dueDate'))}
                    disabled
                    renderInput={props => <MuiTextField {...props} />}
                />
            </LocalizationProvider>
        </Box>
    )
}
