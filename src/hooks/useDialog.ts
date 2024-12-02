import { useContext } from 'react'
import { DialogContext } from 'src/context/DialogContext'

export default function useDialog() {
    const context = useContext(DialogContext)
    return { ...context }
}
