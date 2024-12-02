import { useQuery } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import { CondominiumService } from 'src/services/condominiumService'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'

type ServiceListProps = {
    onViewService: (row: ServiceType) => void
    onEditService: (row: ServiceType) => void
    onDeleteService: (row: ServiceType) => void
    onNewService: () => void
}

export default function ServiceList({ onViewService, onDeleteService, onNewService, onEditService }: ServiceListProps) {
    const serviceQuery = useQuery({
        queryKey: ['services'],
        queryFn: () => CondominiumService.service.get().then(response => response.data),
        select: response => response.results
    })

    const serviceList = serviceQuery.data

    return (
        <Table
            searchField={['name', 'description']}
            topRightActionCallback={onNewService}
            topRightActionLabel='Adicionar Serviço'
            title='Buscar Serviço'
            data={serviceList ?? []}
        >
            <TableCell align='left' header='Nome' field='name' />
            <TableCell align='left' header='Descrição' field='description' />
            <TableCell align='left' header='Categoria' field='account_description' />
            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewService(row as ServiceType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onEditService(row as ServiceType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteService(row as ServiceType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
