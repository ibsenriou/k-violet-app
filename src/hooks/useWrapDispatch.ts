// useWrapDispatch.ts
import { useDispatch } from 'react-redux'

/**
 * Wraps the Redux dispatch action in a standard Promise object.
 * @param action The Redux action to dispatch.
 * @returns A promise resolving to an object containing an optional error string.
 */
export const useWrapDispatch = () => {
    const dispatch = useDispatch()

    const wrapDispatch = async (action: any): Promise<{ error?: string }> => {
        return new Promise(resolve => {
            dispatch(action).then((resolvedAction: any) => {
                if ('error' in resolvedAction) {
                    resolve({ error: resolvedAction.error.message })
                } else {
                    resolve({})
                }
            })
        })
    }

    return wrapDispatch
}
