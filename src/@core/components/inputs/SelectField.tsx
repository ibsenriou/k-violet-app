import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Close from 'mdi-material-ui/Close'
import { useState } from 'react'
import { Controller, ControllerProps, FieldError } from 'react-hook-form'

type SelectFieldProps<ListItem> = {
    control?: any
    name: string
    items: ListItem[]
    disabled?: boolean
    label?: string
    id?: string
    keyValue?: keyof ListItem
    keyLabel?: keyof ListItem
    defaultValue?: string
    error?: FieldError
    renderLabel?: (item: ListItem) => string
    rules?: ControllerProps['rules']
    helperText?: string
    showClear?: boolean
    onClear?: () => void
    value?: any
    onChange?: (e: any) => void
    size?: 'small' | 'medium'
}
function SelectField<ListItem extends {}>({
    control,
    name,
    items,
    disabled,
    label,
    id,
    keyLabel = 'label' as keyof ListItem,
    keyValue = 'value' as keyof ListItem,
    defaultValue,
    error,
    renderLabel = item => String(item[keyLabel]),
    rules,
    value,
    onChange,
    size,
    helperText,
    showClear,
    onClear
}: SelectFieldProps<ListItem>) {
    const [showClearButton, setShowClearButton] = useState(false)

    const SelectComponent = ({ value, onChange }: { value: string; onChange: any }) => (
        <Select
            required
            fullWidth
            value={value}
            id={id || name}
            labelId={`${id || name}-label`}
            label={label}
            onChange={onChange}
            disabled={disabled}
            size={size}
            onFocus={() => setShowClearButton(true)}
            onBlur={() => setShowClearButton(false)}
        >
            {items.map(item => (
                <MenuItem
                    key={String(item[keyValue])}
                    value={item[keyValue] as unknown as string}
                    selected={(item[keyValue] as unknown as string) == value}
                >
                    {renderLabel(item)}
                </MenuItem>
            ))}
        </Select>
    )

    if (!control) {
        return (
            <FormControl fullWidth error={Boolean(error)} size={size}>
                <InputLabel id={`${id || name}-label`}>{label}</InputLabel>
                {showClear && showClearButton && (
                    <Box
                        sx={{
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '30px',
                                top: '8px',
                                zIndex: 9999
                            }}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            <IconButton
                                onClick={e => {
                                    onClear?.()
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>
                )}
                {SelectComponent({ value, onChange })}
                {error?.message && <FormHelperText sx={{ color: 'error.main' }}>{error?.message}</FormHelperText>}
            </FormControl>
        )
    }

    return (
        <FormControl fullWidth error={Boolean(error)} size={size}>
            <InputLabel id={`${id || name}-label`}>{label}</InputLabel>
            {showClear && showClearButton && (
                <Box
                    sx={{
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            right: '30px',
                            top: '8px',
                            zIndex: 9999
                        }}
                        onClick={e => {
                            e.stopPropagation()
                        }}
                    >
                        <IconButton
                            onClick={e => {
                                onClear?.()
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </Box>
            )}
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => SelectComponent({ value, onChange })}
            />
            {error?.message && (
                <FormHelperText sx={{ color: 'error.main' }}>{error?.message || helperText}</FormHelperText>
            )}
        </FormControl>
    )
}

export default SelectField
