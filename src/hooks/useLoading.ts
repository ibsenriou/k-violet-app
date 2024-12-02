import { useState } from 'react'

export default function useLoading<P extends unknown[], R extends Promise<unknown>>(
    func: (...args: P) => R
): [(...args: P) => R, boolean] {
    const [loading, setLoading] = useState(false)
    const proxy = (async (...args: P) => {
        setLoading(true)
        try {
            const result = await func(...args)
            return result as Awaited<R>
        } finally {
            setLoading(false)
        }
    }) as (...args: P) => R
    return [proxy, loading]
}
