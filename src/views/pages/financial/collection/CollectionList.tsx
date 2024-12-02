import { useQuery } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Filter from 'mdi-material-ui/Filter'
import CollectionTable from './components/table/CollectionTable'
import { FinancialService } from 'src/services/financialService'
import FilterDrawer from './components/FilterDrawer'
import { useState } from 'react'
import { useUhabs } from './hooks'
import { AccountingService } from 'src/services/accountingService'
import moment from 'moment'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'

type CollectionListProps = {
    onNewCollection: () => void
    onViewCollection: (collectionId: string) => void
    onDeleteCollection: (collectionId: string) => void
}
export default function CollectionList({ onNewCollection, onViewCollection, onDeleteCollection }: CollectionListProps) {
    const [filterOpen, setFilterOpen] = useState(false)
    const [_filters, setFilters] = useState<{ [key: string]: string }>({})
    const [search, setSearch] = useState('')
    const uhabs = useUhabs()

    const filters = Object.keys(_filters)
        .filter(k => _filters[k as keyof typeof _filters] !== undefined)
        .reduce(
            (acc, key) => {
                return { ...acc, [key]: _filters[key as keyof typeof _filters] }
            },
            { competence_from: moment().startOf('month').toISOString() }
        ) as typeof _filters

    const collectionQuery = useQuery({
        queryKey: [
            'collection',
            ...Object.keys(filters)
                .sort()
                .map(k => filters[k as keyof typeof filters])
        ],
        queryFn: () => {
            const newFilters = { ...filters }
            if (newFilters.competence_from) {
                newFilters.competence_from = moment(newFilters.competence_from).format('YYYYMM')
            }
            if (newFilters.competence_to) {
                newFilters.competence_to = moment(newFilters.competence_to).format('YYYYMM')
            }
            return FinancialService.collections.get(undefined, {
                ...newFilters
            })
        },
        select: response => response.data as CollectionType[]
    })

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(response => response.data)
        },
        select: data =>
            data.results
                .filter(i => i.code.startsWith('4.1.1.2.'))
                .map(i => ({
                    ...i,
                    description: i.description
                        .replace('Despesas C/ Materiais de', '')
                        .replace('Despesas C/ Materiais', '')
                        .replace('Despesas C/', '')
                        .trim()
                })),
        staleTime: 1000 * 60 * 5
    })

    function removeFilter(key: string) {
        const newFiltersWithoutKey = Object.keys(filters)
            .filter(k => (key === 'competence_from' ? k !== 'competence_to' && k !== key : k !== key))
            .reduce((acc, k) => ({ ...acc, [k]: filters[k as keyof typeof filters] }), {})
        setFilters(newFiltersWithoutKey)
    }

    function resolveFilterChip(key: string, value: string) {
        const obj = {
            fk_uhabs: () =>
                value.length > 1
                    ? `Unidades: ${value.length}`
                    : `Unidade: ${uhabs.find(uhab => uhab.id == value[0])?.name}`,
            fk_account: () => `Categoria: ${accountQuery.data?.find(acc => acc.id == value)?.description}`,
            competence_from: () =>
                filters.competence_to
                    ? `Competência: ${moment(value).format('MM/YYYY')} - ${moment(filters.competence_to).format(
                          'MM/YYYY'
                      )}`
                    : `Competencia: ${moment(value).format('MM/YYYY')}`,
            charge_created: () => (value ? 'Apenas Cobranças Vinculadas' : 'Apenas Cobranças Não Vinculadas'),
            nature: () => `Natureza ${value === 'ordinary' ? 'Ordinária' : 'Extraordinária'}`,
            responsible: () => `Responsável: ${value === 'proprietary' ? 'Proprietário' : 'Morador/Locatário'}`
        }

        return obj?.[key as keyof typeof obj]?.()
    }

    function showChipDeleteButton(key: string) {
        if (key !== 'competence_from') return true
        if (
            moment(_filters.competence_from).format('MM/YYYY') === moment().startOf('month').format('MM/YYYY') &&
            !_filters.competence_to
        )
            return false
        return true
    }

    const collections = (collectionQuery.data || []).filter(
        c =>
            c.description.toLowerCase().includes(search.toLowerCase()) ||
            c.competence.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' padding='8px'>
                <Box display='flex' gap='4px' flexWrap='wrap'>
                    <TextField
                        size='small'
                        placeholder='Buscar Arrecadação'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <IconButton onClick={() => setFilterOpen(true)}>
                        <Filter />
                    </IconButton>
                    {Object.keys(filters)
                        .filter(k => filters[k as keyof typeof filters] !== undefined)
                        .map(key => {
                            const chipLabel = resolveFilterChip(key, filters[key as keyof typeof filters])
                            return (
                                chipLabel && (
                                    <Chip
                                        label={chipLabel}
                                        onDelete={showChipDeleteButton(key) ? () => removeFilter(key) : undefined}
                                    />
                                )
                            )
                        })}
                </Box>
                <Box height='40px' width='240px' display='flex' justifyContent='flex-end'>
                    <Button
                        onClick={onNewCollection}
                        variant='contained'
                        sx={{
                            width: '240px'
                        }}
                    >
                        Adicionar Arrecadação
                    </Button>
                </Box>
            </Box>
            <Drawer anchor='right' open={filterOpen} onClose={() => setFilterOpen(false)}>
                <FilterDrawer
                    onFilter={filters => {
                        setFilters(filters)
                        setFilterOpen(false)
                    }}
                    onCancel={() => setFilterOpen(false)}
                    filters={filters}
                />
            </Drawer>
            <CollectionTable
                collections={collections}
                onViewCollection={onViewCollection}
                onDeleteCollection={onDeleteCollection}
                loading={collectionQuery.isLoading}
            />
        </Box>
    )
}
