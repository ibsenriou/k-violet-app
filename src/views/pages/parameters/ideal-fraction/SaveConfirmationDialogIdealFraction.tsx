import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Close from 'mdi-material-ui/Close'
import { ReactNode, useRef, useState } from 'react'
import * as React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

type SaveConfirmationIdealFractionDialogProps<T = undefined> = {
    render: (confirm: (data: T) => void) => ReactNode
    onConfirm: (data: T) => void | Promise<unknown>
    onReject?: () => void
    onClosed?: () => void
    title: string
    subTitle?: string
    content: string
    type?: 'warning' | 'info' | 'error' | 'success'
    loading?: boolean
    confirmLabel?: string
    data?: any
}

function SaveConfirmationIdealFractionDialog<T>({
    render,
    onConfirm,
    onClosed,
    onReject,
    title,
    subTitle,
    content,
    type = 'warning',
    loading,
    confirmLabel = 'Atualizar',
    data
}: SaveConfirmationIdealFractionDialogProps<T>) {
    const [open, setOpen] = useState(false)
    const confirmDataRef = useRef<T>()
    const [loadingHandler, setLoadingHandler] = useState(false)
    const [checked, setChecked] = useState(false)

    function handleClose() {
        setOpen(false)
        onClosed && onClosed()
    }

    function confirm(data: T) {
        setOpen(true)
        confirmDataRef.current = data
    }

    function handleConfirm() {
        if (checked) {
            ;(confirmDataRef.current as any).activated_at = new Date()
        } else {
            ;(confirmDataRef.current as any).activated_at = null
        }

        if (!data.canActive) {
            ;(confirmDataRef.current as any).activated_at = null
        }

        const possiblePromise = onConfirm(confirmDataRef.current as T)
        if (possiblePromise instanceof Promise) {
            setLoadingHandler(true)
            possiblePromise.finally(() => {
                setLoadingHandler(false)
                handleClose()
            })
        } else {
            handleClose()
        }
    }

    function handleReject() {
        onReject && onReject()
        handleClose()
    }

    const component = render(confirm)

    return (
        <>
            {component}
            <Dialog
                fullWidth
                open={open}
                maxWidth='md'
                scroll='body'
                onClose={() => handleClose()}
                onBackdropClick={() => (loading || loadingHandler) && handleClose()}
            >
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton
                        size='small'
                        onClick={() => handleClose()}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                        disabled={loading || loadingHandler}
                    >
                        <Close />
                    </IconButton>

                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            {title}
                        </Typography>
                        <Typography variant='body2'>{subTitle}</Typography>
                    </Box>

                    <Box sx={{ mb: 8 }}>
                        <Alert severity={type}>
                            <AlertTitle>Atenção!</AlertTitle>
                            {content}
                        </Alert>
                    </Box>

                    <Box sx={{ pb: { xs: 8, sm: 12.5 }, display: 'grid', gap: 4 }}>
                        {data?.canActive && (
                            <Box sx={{ mb: 8 }}>
                                <Typography variant='body2'>
                                    Gostaria de ativar a fração ideal agora que alcançou 100% de distribuição?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'start', gap: 2, mt: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                defaultChecked
                                                checked={checked}
                                                onChange={() => setChecked(!checked)}
                                            />
                                        }
                                        label='Ativar'
                                    />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button
                        color={confirmLabel === 'Excluir' ? 'error' : 'primary'}
                        variant='contained'
                        type='submit'
                        sx={{ marginRight: 1 }}
                        onClick={handleConfirm}
                        disabled={loading || loadingHandler}
                        startIcon={loading || loadingHandler ? <CircularProgress size={18} /> : undefined}
                    >
                        {confirmLabel}
                    </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={handleReject}
                        disabled={loading || loadingHandler}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SaveConfirmationIdealFractionDialog
