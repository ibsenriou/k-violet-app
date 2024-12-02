import { PropsOf } from '@emotion/react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type LoadingButtonProps = PropsOf<typeof Button> & {
    loading: boolean
    disabled?: boolean
}

export default function LoadingButton({ loading, disabled, ...props }: LoadingButtonProps) {
    return (
        <Button
            {...props}
            disabled={loading || disabled}
            endIcon={loading ? <CircularProgress size={20} /> : undefined}
        />
    )
}
