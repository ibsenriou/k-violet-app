import TextField from '@core/components/inputs/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export default function TransferAuthorization() {
    const inputRefs = useRef(Array.from({ length: 6 }))
    const { control } = useFormContext()

    return (
        <Box display='flex' gap='16px' justifyContent='center' alignItems='center' flexDirection='column'>
            <Box display='flex' gap='4px' justifyContent='center' alignItems='center' flexDirection='column'>
                <Typography variant='h6'>Código de Validação</Typography>
                <Typography variant='body2'>
                    Foram enviados 6 dígitos para o seu e-mail. Insira-os abaixo para validar a transferência.
                </Typography>
            </Box>
            <Box display='flex' gap='4px' justifyContent='center' alignItems='center'>
                <Controller
                    name='validationCode'
                    defaultValue=''
                    render={({ field }) => (
                        <>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <TextField
                                    inputRef={el => (inputRefs.current[i] = el)}
                                    fullWidth={false}
                                    value={field?.value?.[i] || ''}
                                    sx={{
                                        width: '42px'
                                    }}
                                    onChange={e => {
                                        if (e.target.value.trim() == '') return
                                        let value = field.value.padStart(6, ' ').padEnd(6, ' ')
                                        value =
                                            value.substring(0, i) +
                                            e.target.value.trim().padEnd(1, ' ') +
                                            value.substring(i + 1)
                                        value = value.substring(0, 6).toUpperCase()
                                        field.onChange({
                                            target: { value, name: field.name }
                                        })
                                        if (e.target.value && i < 5) {
                                            ;(inputRefs.current[i + 1] as HTMLInputElement)?.focus()
                                            ;(inputRefs.current[i + 1] as HTMLInputElement)?.setSelectionRange(0, 1)
                                        }
                                    }}
                                />
                            ))}
                        </>
                    )}
                    control={control}
                />
            </Box>
        </Box>
    )
}
