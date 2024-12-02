import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'

export function useUhabs() {
    const residentialQuery = useQuery({
        queryKey: ['residential'],
        queryFn: async () => {
            return CondominiumService.residential.get().then(response => response.data)
        },
        select: data => data.results
    })
    const commercialQuery = useQuery({
        queryKey: ['commercial'],
        queryFn: async () => {
            return CondominiumService.commercial.get().then(response => response.data)
        },
        select: data => data.results
    })

    const residentials = residentialQuery.data || []
    const commercials = commercialQuery.data || []

    const uhabs = residentials
        .map(i => ({
            id: i.id,
            name: i.name,
            type: 'Residencial'
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .concat(
            commercials
                .map(i => ({
                    id: i.id,
                    name: i.name,
                    type: 'Comercial'
                }))
                .sort((a, b) => a.name.localeCompare(b.name))
        )

    return uhabs
}
