import { useContext } from 'react'
import { SnackbarContext } from 'src/context/SnackbarContext'

export default function useSnackbar() {
    return { ...useContext(SnackbarContext) }
}
