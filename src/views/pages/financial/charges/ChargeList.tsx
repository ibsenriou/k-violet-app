import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Filter from 'mdi-material-ui/Filter'
import { FinancialService } from 'src/services/financialService'
import FilterDrawer from './components/FilterDrawer'
import { useState } from 'react'
import { useUhabs } from './hooks'
import moment from 'moment'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'
import Cancel from 'mdi-material-ui/Cancel'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import Undo from 'mdi-material-ui/Undo'

function PaymentActionButton({ row }: { row: any }) {
    const queryClient = useQueryClient()
    const payChargeMutation = useMutation({
        mutationFn: () => {
            return FinancialService.charge_id_pay.post({ chargeId: row.id }, {})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['charge']
            })
        }
    })

    return (
        <IconButton onClick={() => payChargeMutation.mutate()} disabled={payChargeMutation.isPending}>
            {payChargeMutation.isPending ? <CircularProgress size={24} /> : <CurrencyUsd fontSize='small' />}
        </IconButton>
    )
}

function CancelPaymentActionButton({ row }: { row: any }) {
    const queryClient = useQueryClient()
    const cancelPaymentMutation = useMutation({
        mutationFn: () => {
            return FinancialService.charge_id_pay.delete({ chargeId: row.id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['charge']
            })
        }
    })

    return (
        <IconButton onClick={() => cancelPaymentMutation.mutate()} disabled={cancelPaymentMutation.isPending}>
            {cancelPaymentMutation.isPending ? <CircularProgress size={24} /> : <Undo fontSize='small' />}
        </IconButton>
    )
}

function CancelChargeActionButton({ row }: { row: any }) {
    const queryClient = useQueryClient()
    const cancelChargeMutation = useMutation({
        mutationFn: () => {
            return FinancialService.charge_id.delete({ chargeId: row.id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['charge']
            })
        }
    })

    return (
        <IconButton onClick={() => cancelChargeMutation.mutate()} disabled={cancelChargeMutation.isPending}>
            {cancelChargeMutation.isPending ? <CircularProgress size={24} /> : <Cancel fontSize='small' />}
        </IconButton>
    )
}

type ChargeListProps = {
    onNewCharge: () => void
    onViewCharge: (collectionId: string) => void
    onDeleteCharge: (collectionId: string) => void
}
export default function ChargeList({ onNewCharge }: ChargeListProps) {
    const [filterOpen, setFilterOpen] = useState(false)
    const [_filters, setFilters] = useState<{ [key: string]: string }>({})
    const uhabs = useUhabs()

    const filters = Object.keys(_filters)
        .filter(k => _filters[k as keyof typeof _filters] !== undefined)
        .reduce(
            (acc, key) => {
                return { ...acc, [key]: _filters[key as keyof typeof _filters] }
            },
            { competence_from: moment().startOf('month').toISOString() }
        ) as typeof _filters

    const chargeQuery = useQuery({
        queryKey: [
            'charge',
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
            return FinancialService.charges.get(undefined, newFilters)
        },
        select: response => response.data.results
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
            competence_from: () =>
                filters.competence_to
                    ? `Competência: ${moment(value).format('MM/YYYY')} - ${moment(filters.competence_to).format(
                          'MM/YYYY'
                      )}`
                    : `Competencia: ${moment(value).format('MM/YYYY')}`,
            status: () =>
                `Status ${
                    {
                        paid: 'Pago',
                        pending: 'Pendente',
                        overdue: 'Vencido',
                        canceled: 'Cancelado'
                    }[value as string]
                }`
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

    const charges = chargeQuery.data || []

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' padding='8px'>
                <Box display='flex' gap='4px'>
                    <TextField size='small' placeholder='Buscar Cobrança' />
                    <IconButton onClick={() => setFilterOpen(true)}>
                        <Filter />
                    </IconButton>
                    <Box display='flex' gap='4px' alignItems='center'>
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
                </Box>
                <Button onClick={onNewCharge} variant='contained'>
                    Adicionar Cobrança
                </Button>
            </Box>
            <Drawer anchor='right' open={filterOpen} onClose={() => setFilterOpen(false)}>
                <FilterDrawer onFilter={setFilters} onCancel={() => setFilterOpen(false)} filters={filters} />
            </Drawer>
            <Table data={charges}>
                <TableCell header='Unidade' field='uhab_name' />
                <TableCell header='Responsável' field='responsible_name' />
                <TableCell header='Competência' field='competence' formatType='competence' />
                <TableCell header='Vencimento' field='due_date' formatType='date' />
                <TableCell header='Valor' field='amount' formatType='currency' />
                <TableCell header='Status' field='status_label'>
                    {({ row }: DataParams<any>) =>
                        ({
                            paid: 'Pago',
                            pending: 'Pendente',
                            canceled: 'Cancelado'
                        }?.[row.status_label as string] || '')
                    }
                </TableCell>
                <TableCell header='Ações' field='actions'>
                    {({ row }: DataParams<any>) =>
                        row.status_label != 'canceled' && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {row.status_label === 'paid' ? (
                                    <CancelPaymentActionButton row={row} />
                                ) : (
                                    <PaymentActionButton row={row} />
                                )}
                                <CancelChargeActionButton row={row} />
                            </Box>
                        )
                    }
                </TableCell>
            </Table>
        </Box>
    )
}
