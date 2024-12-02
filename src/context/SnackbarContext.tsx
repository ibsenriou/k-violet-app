import { createContext, useCallback, useMemo, useState } from 'react'
import SnackbarAlert, { SnackbarAlertProps } from '@core/components/snackbar-alert/SnackbarAlert'

type SnackbarContextType = {
    success: (message: string) => void
    error: (message: string) => void
    alert: (message: string) => void
    info: (message: string) => void
}

export const SnackbarContext = createContext<SnackbarContextType>({
    success: () => {},
    error: () => {},
    alert: () => {},
    info: () => {}
})

type SnackbarProviderProps = {
    children: React.ReactNode
}
export function SnackbarProvider({ children }: SnackbarProviderProps) {
    const [snackbarData, setState] = useState<SnackbarAlertProps>({
        open: false,
        message: '',
        severity: 'success',
        toggle: () => {}
    })

    const action = useCallback((message: string, severity: 'error' | 'info' | 'success' | 'warning') => {
        setState({
            open: true,
            message,
            severity,
            toggle: () => setState(snackbarData => ({ ...snackbarData, open: false }))
        })
    }, [])

    const success = useCallback((message: string) => action(message, 'success'), [action])
    const error = useCallback((message: string) => action(message, 'error'), [action])
    const alert = useCallback((message: string) => action(message, 'warning'), [action])
    const info = useCallback((message: string) => action(message, 'info'), [action])

    const value = useMemo(() => ({ success, error, alert, info }), [success, error, alert, info])
    const _children = useMemo(() => children, [children])

    return (
        <SnackbarContext.Provider value={value}>
            {_children}
            <SnackbarAlert
                open={snackbarData.open}
                message={snackbarData.message}
                severity={snackbarData.severity}
                toggle={snackbarData.toggle}
            />
        </SnackbarContext.Provider>
    )
}
