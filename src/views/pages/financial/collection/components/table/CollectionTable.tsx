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
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'
import CollectionRow from './CollectionRow'
import { useMemo, useState } from 'react'

type CollectionTableProps = {
    collections: CollectionType[]
    onViewCollection: (collectionId: string) => void
    onDeleteCollection: (collectionId: string) => void
    loading?: boolean
}
export default function CollectionTable({
    collections,
    loading,
    onViewCollection,
    onDeleteCollection
}: CollectionTableProps) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - collections.length) : 0

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const visibleRows = useMemo(
        () => collections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, collections]
    )

    return (
        <>
            <TableContainer component={Paper} className='collection-table'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={120}></TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Competência</TableCell>
                            <TableCell>Valor Total</TableCell>
                            <TableCell>Cobrança gerada?</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                        {loading && (
                            <TableRow>
                                <TableCell sx={{ padding: '0px !important' }} colSpan={6} align='center'>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {!loading &&
                            visibleRows.map(collection => (
                                <CollectionRow
                                    collection={collection}
                                    onViewCollection={onViewCollection}
                                    onDeleteCollection={onDeleteCollection}
                                />
                            ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        {collections.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align='center'>
                                    <Box display='flex' flexDirection='column' alignItems='center'>
                                        <Box>Nenhuma arrecadação encontrada</Box>
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
                count={collections.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}
