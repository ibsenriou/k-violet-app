import { useQuery } from '@tanstack/react-query'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import Filter from 'mdi-material-ui/Filter'
import moment from 'moment'
import { useState } from 'react'
import FilterDrawer from './components/FilterDrawer'
import UserOccurrenceTable from './components/table/UserOccurrenceTable'
import { CondominiumService } from 'src/services/condominiumService'
import { CondominiumUserOccurrenceType } from '@typesApiMapping/apps/condominium/condominiumUserOccurrenceTypes'
import { usePermission } from 'src/context/PermissionContext'

type OccurrenceListProps = {
    onNewOccurrence: () => void
    onViewOccurrence: (occurrenceId: string) => void
}

export default function UserOccurrencesList({ onNewOccurrence, onViewOccurrence }: OccurrenceListProps) {
    const [filterOpen, setFilterOpen] = useState(false)
    const [_filters, setFilters] = useState<{ [key: string]: string }>({})
    const [search, setSearch] = useState('')
    const permission = usePermission()

    const filters = Object.keys(_filters)
        .filter(k => _filters[k as keyof typeof _filters] !== undefined)
        .reduce(
            (acc, key) => {
                return { ...acc, [key]: _filters[key as keyof typeof _filters] }
            },

            {
                launch_date_from: moment().startOf('month').toISOString(),
                launch_date_to: moment().endOf('month').toISOString()
            }
        ) as typeof _filters

    const userOccurrencesQuery = useQuery({
        queryKey: [
            'userOccurrences',
            ...Object.keys(filters)
                .sort()
                .map(k => filters[k as keyof typeof filters])
        ],
        queryFn: () => {
            const newFilters = { ...filters }
            if (newFilters.launch_date_from) {
                newFilters.launch_date_from = moment(newFilters.launch_date_from).format('YYYY-MM-DD')
            }
            if (newFilters.launch_date_to) {
                newFilters.launch_date_to = moment(newFilters.launch_date_to).format('YYYY-MM-DD')
            }
            if (newFilters.status) {
                newFilters.status = newFilters.status
            }

            return CondominiumService.condominium_user_occurrence.get(undefined, {
                ...newFilters
            })
        },
        select: response => response.data.results
    })

    function removeFilter(key: string) {
        const newFiltersWithoutKey = Object.keys(filters)
            .filter(k => (key === 'due_date_from' ? k !== 'due_date_to' && k !== key : k !== key))
            .reduce((acc, k) => ({ ...acc, [k]: filters[k as keyof typeof filters] }), {})
        setFilters(newFiltersWithoutKey)
    }

    function resolveFilterChip(key: string, value: string) {
        const obj = {
            launch_date_from: () =>
                filters.launch_date_to
                    ? `Lançamento: ${moment(value).format('DD/MM/YYYY')} - ${moment(filters.launch_date_to).format(
                          'DD/MM/YYYY'
                      )}`
                    : `Lançamento: ${moment(value).format('DD/MM/YYYY')}`,
            status: () =>
                `Status: ${
                    {
                        open: 'Aberto',
                        in_progress: 'Em Andamento',
                        resolved: 'Fechado'
                    }[value as string]
                }`
        }

        return obj?.[key as keyof typeof obj]?.()
    }

    function showChipDeleteButton(key: string) {
        if (key !== 'launch_date_from') return true

        const launchDateFrom = moment(_filters.launch_date_from)
        const launchDateTo = moment(_filters.launch_date_to)
        const startOfMonth = moment().startOf('month')
        const endOfMonth = moment().endOf('month')

        if (
            (launchDateFrom.isValid() &&
                launchDateTo.isValid() &&
                launchDateFrom.isSame(startOfMonth, 'day') &&
                launchDateTo.isSame(endOfMonth, 'day')) ||
            // By default there is a bug where the original date is coming both as today, if
            // date is same as today, also return false
            (launchDateFrom.isSame(moment(), 'day') && launchDateTo.isSame(moment(), 'day'))
        ) {
            return false
        }

        return true
    }

    const occurrences: CondominiumUserOccurrenceType[] | [] = (userOccurrencesQuery.data || []).filter(
        (occurrence: CondominiumUserOccurrenceType) => occurrence.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' padding='8px'>
                <Box display='flex' gap='4px' flexWrap='wrap'>
                    <TextField
                        size='small'
                        placeholder='Buscar Ocorrência'
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
                        onClick={onNewOccurrence}
                        variant='contained'
                        disabled={!permission.can('condominium.user_occurrence:create')}
                        sx={{
                            width: '240px'
                        }}
                    >
                        Adicionar Ocorrência
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
            <UserOccurrenceTable
                occurrences={occurrences}
                onViewOccurrence={onViewOccurrence}
                loading={userOccurrencesQuery.isLoading}
            />
        </Box>
    )
}
