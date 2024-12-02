import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField'; 
import { ComponentProps } from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'

type PostalCodeInputProps = {
    control: Control<any> | undefined
    disabled: boolean
    loading: boolean
    onBlur: (value: string | undefined) => void
    error: FieldError | undefined
    name: string
    label?: string
    defaultValue?: string
}
function PostalCodeInput({
    control,
    loading,
    disabled,
    onBlur,
    error,
    name,
    label,
    defaultValue
}: PostalCodeInputProps) {
    return (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <ReactInputMask
                        mask='99999-999'
                        value={value || ''}
                        onChange={onChange}
                        disabled={disabled}
                        onBlur={() => onBlur(value)}
                    >
                        {(inputProps: ComponentProps<typeof TextField>) => (
                            <TextField
                                {...inputProps}
                                disabled={disabled}
                                label={label}
                                placeholder='XXXXX-XXX'
                                error={Boolean(error?.message)}
                                InputProps={{
                                    endAdornment: loading ? <CircularProgress size={20} /> : null
                                }}
                            />
                        )}
                    </ReactInputMask>
                )}
            />
            {error?.message && <FormHelperText sx={{ color: 'error.main' }}>{error?.message}</FormHelperText>}
        </FormControl>
    )
}

export default PostalCodeInput
