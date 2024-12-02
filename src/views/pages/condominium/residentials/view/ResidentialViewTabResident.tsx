import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'
import DialogContainer from '@core/components/dialog-container'

import ResidentActionsDialog from './detail/ResidentActionsDialog'

import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'

import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import { DataParams } from '@core/components/table/types'
import { usePermission } from 'src/context/PermissionContext'
import { CondominiumService } from 'src/services/condominiumService'
import { useQuery } from '@tanstack/react-query'

const Img = styled('img')(({ theme }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: theme.spacing(3),
    objectFit: 'cover'
}))

interface Person {
    id: number
    name: string
    date_of_birth: string
    email: string
    cell_phone_number: string
    avatar_image_file_name: string
    person_contact_information_set: PersonContactInformationType[]
    national_individual_taxpayer_identification: string
}

interface ResidentData extends Person {
    is_this_the_main_role: boolean
}

const ResidentialViewTabResident = () => {
    const [residentData, setResidentData] = useState<ResidentData>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleResidentDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.residentialDetail)
    const { residential } = store.data

    const residentsQuery = useQuery({
      queryKey: ['residential.residents', residential.id],
      queryFn: () =>
          CondominiumService.residentialId_residents
              .get({ residentialId: residential.id })
              .then(response => response.data)
  })
    const residents = residentsQuery.data?.results ?? []

    const residentsSorted = [...residents].sort((a, b) => a.name.localeCompare(b.name))

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', resident?: any) => {
        setResidentData(resident)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const permissions = usePermission('condominium.residential', { residentialId: residential.id })

    const canAddResident = permissions.can('residents:create')
    const canViewResident = permissions.can('residents:retrieve')
    const canUpdateResident = permissions.can('residents:update')
    const canDeleteResident = permissions.can('residents:delete')

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='name'
                topRightActionLabel={canAddResident ? 'Adicionar Morador' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Morador'
                data={residentsSorted ?? []}
                noRowsMessage='Este residencial não possui moradores cadastrados.'
                noRowsFilterMessage='Nenhum morador cadastrado.'
                loading={residentsQuery.isLoading}
            >
                <TableCell align='left' header='Morador' field='name'>
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

                <TableCell width={120} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewResident && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canUpdateResident && (
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeleteResident && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <DialogContainer open={toggleDialog}>
                <ResidentActionsDialog
                    key={residentData?.id ?? String(toggleDialog)}
                    actionType={actionType}
                    actionData={residentData}
                    open={toggleDialog}
                    toggle={toggleResidentDialog}
                    residentialId={residential?.id}
                />
            </DialogContainer>

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default ResidentialViewTabResident
