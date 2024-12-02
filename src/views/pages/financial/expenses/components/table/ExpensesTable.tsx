import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import { useMemo, useState } from 'react'
import ExpensesRow from './ExpensesRow'

type ExpensesTableProps = {
    expenses: ExpenseType[]
    onPayExpense: (expenseId: string) => void
    onViewExpense: (expenseId: string) => void
    onDeleteExpense: (expenseId: string) => void
    loading?: boolean
}
export default function ExpensesTable({
    expenses,
    loading,
    onPayExpense,
    onViewExpense,
    onDeleteExpense
}: ExpensesTableProps) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - expenses.length) : 0

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // On rerender caused by filter change or searchfield, return the row to the first page
    useMemo(() => {
        setPage(0)
    }, [expenses])

    const visibleRows = useMemo(
        () => expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),

        [page, rowsPerPage, expenses]
    )

    return (
        <>
            <TableContainer component={Paper} className='collection-table'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fornecedor</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Parcela</TableCell>
                            <TableCell>Competência</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell>Pagamento</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                        {loading && (
                            <TableRow>
                                <TableCell sx={{ padding: '0px !important' }} colSpan={8} align='center'>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {!loading &&
                            visibleRows.map(expense => (
                                <ExpensesRow
                                    expense={expense}
                                    onPayExpense={onPayExpense}
                                    onViewExpense={onViewExpense}
                                    onDeleteExpense={onDeleteExpense}
                                />
                            ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={9} />
                            </TableRow>
                        )}
                        {expenses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align='center'>
                                    <Box display='flex' flexDirection='column' alignItems='center'>
                                        <Box>Nenhuma despesa encontrada</Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}
