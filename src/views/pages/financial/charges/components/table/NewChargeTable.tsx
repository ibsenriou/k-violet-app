import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import NewChargeRow from './NewChargeRow'
import { NewChargeCollection } from '@typesApiMapping/apps/financial/chargeTypes'

type CollectionTableProps = {
    collections: NewChargeCollection[]
}
export default function NewChargeTable({ collections }: CollectionTableProps) {
    return (
        <TableContainer component={Paper} className='collection-table'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={120}></TableCell>
                        <TableCell width={120}>Unidade</TableCell>
                        <TableCell>Responsável</TableCell>
                        <TableCell width={120}>Valor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collections.map(collection => (
                        <NewChargeRow collection={collection} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
