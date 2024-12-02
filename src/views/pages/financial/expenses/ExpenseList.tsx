import { useQuery } from '@tanstack/react-query'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import Filter from 'mdi-material-ui/Filter'
import moment from 'moment'
import { useState } from 'react'
import { FinancialService } from 'src/services/financialService'
import FilterDrawer from './components/FilterDrawer'
import ExpensesTable from './components/table/ExpensesTable'
import { CondominiumService } from 'src/services/condominiumService'

type ExpenseListProps = {
    onNewExpense: () => void
    onPayExpense: (expenseId: string) => void
    onViewExpense: (expenseId: string) => void
    onDeleteExpense: (expenseId: string) => void
}

export default function ExpenseList({ onNewExpense, onPayExpense, onViewExpense, onDeleteExpense }: ExpenseListProps) {
    const [filterOpen, setFilterOpen] = useState(false)
    const [_filters, setFilters] = useState<{ [key: string]: string }>({})
    const [search, setSearch] = useState('')

    const filters = Object.keys(_filters)
        .filter(k => _filters[k as keyof typeof _filters] !== undefined)
        .reduce(
            (acc, key) => {
                return { ...acc, [key]: _filters[key as keyof typeof _filters] }
            },
            {
                due_date_from: moment().startOf('month').toISOString(),
                due_date_to: moment().endOf('month').toISOString()
            }
        ) as typeof _filters

    const supplierQuery = useQuery({
        queryKey: ['supplier'],
        queryFn: () => {
            return CondominiumService.suppliers.get().then(response => response.data)
        },
        select: data => data.results,
        staleTime: 1000 * 60 * 5
    })

    const expensesQuery = useQuery({
        queryKey: [
            'expense',
            ...Object.keys(filters)
                .sort()
                .map(k => filters[k as keyof typeof filters])
        ],
        queryFn: () => {
            const newFilters = { ...filters }
            if (newFilters.due_date_from) {
                newFilters.due_date_from = moment(newFilters.due_date_from).format('YYYY-MM-DD')
            }
            if (newFilters.due_date_to) {
                newFilters.due_date_to = moment(newFilters.due_date_to).format('YYYY-MM-DD')
            }
            if (newFilters.competence_from) {
                newFilters.competence_from = moment(newFilters.competence_from).format('YYYYMM')
            }
            if (newFilters.competence_to) {
                newFilters.competence_to = moment(newFilters.competence_to).format('YYYYMM')
            }
            if (newFilters.payment_date) {
                newFilters.payment_date = moment(newFilters.payment_date).format('YYYY-MM-DD')
            }

            return FinancialService.expenses.get(undefined, {
                ...newFilters
            })
        },
        select: response => response.data
    })

    function removeFilter(key: string) {
        const newFiltersWithoutKey = Object.keys(filters)
            .filter(k => (key === 'due_date_from' ? k !== 'due_date_to' && k !== key : k !== key))
            .filter(k => (key === 'competence_from' ? k !== 'competence_to' && k !== key : k !== key))
            .reduce((acc, k) => ({ ...acc, [k]: filters[k as keyof typeof filters] }), {})
        setFilters(newFiltersWithoutKey)
    }

    function resolveFilterChip(key: string, value: string) {
        const obj = {
            competence_from: () =>
                filters.competence_to
                    ? `Competência: ${moment(value).format('MM/YYYY')} - ${moment(filters.competence_to).format(
                          'MM/YYYY'
                      )}`
                    : `Competencia: ${moment(value).format('MM/YYYY')}`,
            due_date_from: () =>
                filters.due_date_to
                    ? `Vencimento: ${moment(value).format('DD/MM/YYYY')} - ${moment(filters.due_date_to).format(
                          'DD/MM/YYYY'
                      )}`
                    : `Vencimento: ${moment(value).format('DD/MM/YYYY')}`,
            payment_date: () => `Pagamento: ${moment(value).format('DD/MM/YYYY')}`,
            fk_supplier: () => `Fornecedor: ${supplierQuery.data?.find(supplier => supplier.id == value)?.name}`,
            status: () =>
                `Status: ${
                    {
                        paid: 'Pago',
                        pending: 'Pendente',
                        overdue: 'Vencido',
                        canceled: 'Cancelado'
                    }[value as string]
                }`,
            expense_type: () =>
                `Tipo de Despesa: ${
                    {
                        ordinary: 'Ordinária',
                        extraordinary: 'Extraordinária'
                    }[value as string]
                }`
        }

        return obj?.[key as keyof typeof obj]?.()
    }

    function showChipDeleteButton(key: string) {
        if (key !== 'due_date_from') return true

        const dueDateFrom = moment(_filters.due_date_from)
        const dueDateTo = moment(_filters.due_date_to)
        const startOfMonth = moment().startOf('month')
        const endOfMonth = moment().endOf('month')

        // Check if both dates are valid before comparison
        if (
            (dueDateFrom.isValid() &&
                dueDateTo.isValid() &&
                dueDateFrom.isSame(startOfMonth, 'day') &&
                dueDateTo.isSame(endOfMonth, 'day')) ||

            // By default there is a bug where the original date is coming both as today, if
            // date is same as today, also return false
            (dueDateFrom.isSame(moment(), 'day') && dueDateTo.isSame(moment(), 'day'))
        ) {
            return false
        }

        return true
    }

    const expenses: ExpenseType[] | [] = (expensesQuery.data || []).filter((expense: ExpenseType) =>
        expense.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' padding='8px'>
                <Box display='flex' gap='4px' flexWrap='wrap'>
                    <TextField
                        size='small'
                        placeholder='Buscar Despesa'
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
                        onClick={onNewExpense}
                        variant='contained'
                        sx={{
                            width: '240px'
                        }}
                    >
                        Adicionar Despesa
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
            <ExpensesTable
                expenses={expenses}
                onPayExpense={onPayExpense}
                onViewExpense={onViewExpense}
                onDeleteExpense={onDeleteExpense}
                loading={expensesQuery.isLoading}
            />
        </Box>
    )
}
