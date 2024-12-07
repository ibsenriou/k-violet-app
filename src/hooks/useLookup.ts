import { useMemo } from 'react'
import { ServiceRequest } from 'src/services/Url'
import useService from './useService'

type LookupBaseModel = {
    id: string
    description: string
}

export default function useLookup<Enum>(service: ServiceRequest<null, LookupBaseModel[]>): Enum {
    const { data } = useService(service)

    const enumData = useMemo(() => {
        const obj = {} as Record<string, string>
        if (!data || !Array.isArray(data)) return {} as Enum
        for (const item of data) {
            const description = item.description.replace(/ /g, '').replace(/-/g, '')
            obj[description] = item.id
        }

        return obj as unknown as Enum
    }, [data])

    return enumData as unknown as Enum
}
