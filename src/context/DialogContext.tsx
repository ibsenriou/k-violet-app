import { Fragment, ReactElement, ReactNode, createContext, useCallback, useMemo, useState } from 'react'

type OnClose = () => void

type DialogContextType = {
    open: (fn: (onClose: OnClose) => ReactNode) => void
}

export const DialogContext = createContext<DialogContextType>({
    open: () => {}
})

type DialogProviderProps = {
    children: ReactNode
}
export function DialogProvider({ children }: DialogProviderProps) {
    const [dialogs, setDialogs] = useState<{ key: string; component: ReactNode }[]>([])

    const open = useCallback((fn: (onClose: OnClose) => ReactNode) => {
        const component = fn(onCloseHandler)
        const key = Date.now().toString()

        function onCloseHandler() {
            setDialogs(dialogs => dialogs.filter(dialog => dialog.key !== key))
        }

        setDialogs(dialogs => [
            ...dialogs,
            {
                key: key,
                component
            }
        ])
    }, [])

    const _children = useMemo(() => children, [children])

    const controller = useMemo(
        () => ({
            open
        }),
        [open]
    )

    return (
        <DialogContext.Provider value={controller}>
            {_children}
            {dialogs.map(({ key, component }) => (
                <Fragment key={key}>{component}</Fragment>
            ))}
        </DialogContext.Provider>
    )
}
