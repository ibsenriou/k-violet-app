import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useQuery } from '@tanstack/react-query'
import { UserRoleType } from '@typesApiMapping/apps/access-control/userRoleTypes'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { AccessControlService } from 'src/services/accessControlService'

type UserRoleListProps = {
    onDeleteUserRole: (id: UserRoleType) => void
    onNewUserRole: () => void
}

export default function UserRoleList({ onDeleteUserRole, onNewUserRole }: UserRoleListProps) {
    const userRoleQuery = useQuery({
        queryKey: ['user_role'],
        queryFn: () => AccessControlService.user_role.get().then(response => response.data),
        select: response => response.results
    })

    const userRoleList = userRoleQuery.data

    return (
        <Table
            searchField={['user_first_name', 'user_email', 'role_name']}
            topRightActionCallback={onNewUserRole}
            topRightActionLabel='Adicionar Usuário'
            title='Buscar Usuário'
            data={userRoleList ?? []}
        >
            <TableCell align='left' header='Nome' field='user_first_name' />
            <TableCell align='left' header='Email' field='user_email' />
            <TableCell align='left' header='Perfil' field='role_name' />

            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onDeleteUserRole(row as UserRoleType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
