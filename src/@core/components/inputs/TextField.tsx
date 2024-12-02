import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import { Control, Controller, ControllerProps, FieldError } from 'react-hook-form'
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import Close from 'mdi-material-ui/Close'

type TextFieldProps = {
    control?: Control<any>
    label?: string
    name?: string
    disabled?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: FieldError
    defaultValue?: string
    size?: 'small' | 'medium'
    showClear?: boolean
    placeholder?: string
    startAdornment?: React.ReactNode
    endAdornment?: React.ReactNode
    multiline?: boolean
    rules?: ControllerProps['rules']
    sx?: MuiTextFieldProps['sx']
    fullWidth?: boolean
    variant?: MuiTextFieldProps['variant']
    helperText?: string
    inputRef?: React.Ref<HTMLInputElement>
}
function TextField({
    control,
    label,
    name,
    disabled,
    value,
    onChange,
    error,
    defaultValue,
    size,
    showClear,
    placeholder,
    startAdornment,
    endAdornment,
    multiline,
    fullWidth = true,
    rules,
    sx,
    variant,
    helperText,
    inputRef
}: TextFieldProps) {
    const Input = (props?: MuiTextFieldProps) => (
        <MuiTextField
            size={size}
            name={name}
            label={label}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            error={Boolean(error)}
            placeholder={placeholder}
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
            helperText={error?.message || helperText}
            fullWidth={fullWidth}
            autoComplete='off'
            variant={variant}
            sx={{
                [`&.MuiTextField-root .${name}-clear-icon-button`]: {
                    visibility: 'hidden'
                },
                [`&.MuiTextField-root:hover .${name}-clear-icon-button`]: {
                    visibility: 'visible'
                },
                ...sx
            }}
            InputProps={{
                startAdornment: startAdornment,
                inputRef: inputRef,
                endAdornment: showClear ? (
                    <IconButton
                        className={name + '-clear-icon-button'}
                        size='small'
                        onClick={() => {
                            if (onChange) {
                                onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                ) : (
                    endAdornment
                )
            }}
            {...props}
        />
    )

    return (
        <FormControl fullWidth={fullWidth} error={Boolean(error)}>
            {control ? (
                <Controller
                    name={name!}
                    control={control}
                    defaultValue={defaultValue}
                    rules={rules}
                    render={({ field: { value, onChange } }) => Input({ value, onChange })}
                />
            ) : (
                Input()
            )}
        </FormControl>
    )
}

export default TextField
