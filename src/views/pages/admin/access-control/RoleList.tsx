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

import { RoleType } from '@typesApiMapping/apps/access-control/roleTypes'
import { AccessControlService } from 'src/services/accessControlService'

type RoleListProps = {
    onViewRole: (row: RoleType) => void
    onEditRole: (row: RoleType) => void
    onDeleteRole: (row: RoleType) => void
    onNewRole: () => void
}

export default function RoleListList({ onViewRole, onDeleteRole, onNewRole, onEditRole }: RoleListProps) {
    const roleQuery = useQuery({
        queryKey: ['roles'],
        queryFn: () => AccessControlService.role.get().then(response => response.data),
        select: response => response.results
    })

    const roleList = roleQuery.data

    return (
        <Table
            searchField={['name']}
            topRightActionCallback={onNewRole}
            topRightActionLabel='Adicionar Perfil'
            title='Buscar Perfil'
            data={roleList ?? []}
        >
            <TableCell align='left' header='Nome' field='name' />
            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewRole(row as RoleType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onEditRole(row as RoleType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteRole(row as RoleType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
