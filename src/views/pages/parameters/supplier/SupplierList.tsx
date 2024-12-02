import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

import { useQuery } from '@tanstack/react-query'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'
import { addCNPJMask, addCPFMask } from '@core/utils/validate-national_individual_taxpayer_identification'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { CondominiumService } from 'src/services/condominiumService'

type SupplierListProps = {
    onViewSupplier: (row: SupplierType) => void
    onDeleteSupplier: (row: SupplierType) => void
    onNewSupplier: () => void
}

export default function SupplierList({ onViewSupplier, onDeleteSupplier, onNewSupplier }: SupplierListProps) {
    const supplierQuery = useQuery({
        queryKey: ['supplier'],
        queryFn: () => CondominiumService.suppliers.get().then(response => response.data),
        select: response => response.results,
        staleTime: 1000 * 60 * 5
    })

    const supplierList = supplierQuery.data

    return (
        <Table
            searchField={['name', 'identification', 'email', 'cell_phone_number']}
            topRightActionCallback={onNewSupplier}
            topRightActionLabel='Adicionar Fornecedor'
            title='Buscar Fornecedor'
            data={supplierList ?? []}
        >
            <TableCell align='left' header='Nome' field='name' />
            <TableCell
                align='left'
                header='CPF/CNPJ'
                field='identification'
                valueGetter={({ row }) => {
                    return row.identification && row.identification.length === 11
                        ? addCPFMask(row.identification)
                        : addCNPJMask(row.identification)
                }}
            />
            <TableCell align='left' header='E-mail' field='email' />
            <TableCell align='left' header='Telefone' field='cell_phone_number' />
            <TableCell width={90} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewSupplier(row as SupplierType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteSupplier(row as SupplierType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
