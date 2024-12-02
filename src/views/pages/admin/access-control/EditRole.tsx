import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery } from '@tanstack/react-query'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { AccessControlService } from 'src/services/accessControlService'

type EditRoleProps = {
    roleId: string
    onAddPermission: () => void
}

export default function EditRole({ roleId, onAddPermission }: EditRoleProps) {
    const roleQuery = useQuery({
        queryKey: ['roles', roleId],
        queryFn: () =>
            AccessControlService.role_id
                .get({
                    roleId
                })
                .then(response => response.data)
    })

    const rolePermissionsQuery = useQuery({
        queryKey: ['roles', roleId, 'permissions'],
        queryFn: () =>
            AccessControlService.role_permission.get({
                roleId
            }),
        select: reponse => reponse.data.results
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => AccessControlService.role_permission_id.delete({ id }),
        onSettled: () => {
            rolePermissionsQuery.refetch()
        }
    })

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box margin={2}>
                    <TextField
                        size='small'
                        name='search-table-field'
                        label={'Perfil'}
                        defaultValue={roleQuery.data?.name}
                        key={roleQuery.dataUpdatedAt}
                    />
                </Box>
                <Box margin={2}>
                    <Button variant='contained' color='primary' onClick={onAddPermission}>
                        Adicionar Permissão
                    </Button>
                </Box>
            </Box>
            <Table data={rolePermissionsQuery.data || []}>
                <TableCell header='Permissão' field='permission' />
                <TableCell width={135} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => deleteMutation.mutate(row.id)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                        </Box>
                    )}
                </TableCell>
            </Table>
        </Box>
    )
}
