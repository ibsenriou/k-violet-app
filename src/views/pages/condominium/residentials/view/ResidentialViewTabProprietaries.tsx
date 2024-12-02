import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, useAppSelector } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import ProprietaryActionsDialog from './detail/ProprietaryActionsDialog'

import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import { DataParams } from '@core/components/table/types'
import { usePermission } from 'src/context/PermissionContext'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'

const Img = styled('img')(({ theme }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: theme.spacing(3),
    objectFit: 'cover'
}))

interface ProprietaryData {
    id: number
    name: string
    national_individual_taxpayer_identification: string
    date_of_birth: string
    email: string
    phone_number: string
    avatar_image_file_name: string
}

const ResidentialViewTabProprietaries = () => {
    const [proprietaryData, setProprietaryData] = useState<ProprietaryData>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleProprietaryDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.residentialDetail)
    const { residential } = store.data

    const proprietariesQuery = useQuery({
        queryKey: ['residential.proprietaries', residential.id],
        queryFn: () =>
            CondominiumService.residentialId_proprietaries
                .get({ residentialId: residential.id })
                .then(response => response.data)
    })
    const proprietaries = proprietariesQuery.data?.results ?? []

    const proprietariesSorted = [...proprietaries].sort((a, b) => a.name.localeCompare(b.name))

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', proprietary?: any) => {
        setProprietaryData(proprietary)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const permissions = usePermission('condominium.residential', { residentialId: residential.id })

    const canAddProprietary = permissions.can('proprietary:create')
    const canViewProprietary = permissions.can('proprietary:retrieve')
    const canDeleteProprietary = permissions.can('proprietary:delete')

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='name'
                topRightActionLabel={canAddProprietary ? 'Adicionar Proprietário' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Proprietário'
                data={proprietariesSorted ?? []}
                noRowsMessage='Este residencial não possui proprietários cadastrados.'
                noRowsFilterMessage='Nenhum proprietário cadastrado.'
                loading={proprietariesQuery.isLoading}
            >
                <TableCell align='left' header='Proprietário' field='name'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'success'}
                                sx={{ fontWeight: 600, borderRadius: '50%', width: 40, height: 40, mr: 4 }}
                            >
                                {getInitials(row.name)}
                            </CustomAvatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
                            </Box>
                        </Box>
                    )}
                </TableCell>

                <TableCell align='left' header='Contatos' field='person_contact_information_set'>
                    {({ value }: DataParams<any>) => (
                        <Box>
                            {value.map((contact: any) => (
                                <Typography variant='body2' key={contact.id}>
                                    {contact.description}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </TableCell>

                <TableCell width={90} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewProprietary && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeleteProprietary && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <ProprietaryActionsDialog
                key={proprietaryData?.id ?? String(toggleDialog)}
                actionType={actionType}
                actionData={proprietaryData}
                open={toggleDialog}
                toggle={toggleProprietaryDialog}
                residentialId={residential?.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default ResidentialViewTabProprietaries
