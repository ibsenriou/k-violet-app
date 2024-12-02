// ** React Imports
import { Fragment, SyntheticEvent } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

export type SnackbarAlertProps = {
    open: boolean
    toggle: () => void
    message?: string
    severity?: 'error' | 'info' | 'success' | 'warning'
}

const SnackbarAlert = ({ open, toggle, message, severity }: SnackbarAlertProps) => {
    // ** State

    const handleClose = (event?: Event | SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        toggle()
    }

    return (
        <Fragment>
            <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
                <Alert variant='filled' elevation={3} onClose={handleClose} severity={severity ? severity : 'success'}>
                    {message ? message : 'Ação realizada com sucesso!'}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}

export default SnackbarAlert
