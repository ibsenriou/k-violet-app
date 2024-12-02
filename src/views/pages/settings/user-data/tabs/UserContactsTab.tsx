import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import UserContactsActionsDialog from './UserContactsActionsDialog'

import { useAppSelector } from 'src/store'
import { selectUserContactInformation, selectUserNatualPerson } from 'src/store/apps/user'

import { LookupTypeOfContactInformationType } from '@typesApiMapping/apps/lookups/lookupTypeOfContactInformationTypes'

import useService from 'src/hooks/useService'

import { LookupsService } from 'src/services/lookupsService'
import { DataParams } from '@core/components/table/types'

const UserContactsTab = () => {
    const [contacData, setContactData] = useState<LookupTypeOfContactInformationType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleContactDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const { find: findContactInformationType } = useService(LookupsService.lookup_type_of_contact_information)
    const findContactInformationDescription = (fk_lookup_type_of_contact_information: string) =>
        findContactInformationType(fk_lookup_type_of_contact_information)?.description

    const natualPerson = useAppSelector(selectUserNatualPerson)
    const contactInformation = useAppSelector(selectUserContactInformation)

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', contact?: any) => {
        setContactData(contact)
        setActionType(actionType)
        setToggleDialog(true)
    }

    return (
        <Card>
            <Table
                searchField='description'
                topRightActionLabel='Adicionar Contato'
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Contato'
                data={contactInformation ?? []}
                noRowsMessage='Seu usuário não possui contatos cadastrados.'
                noRowsFilterMessage='Nenhum contato encontrado.'
            >
                <TableCell
                    align='left'
                    header='Tipo de Contato'
                    field='fk_lookup_type_of_contact_information'
                    format={findContactInformationDescription}
                />
                <TableCell align='left' header='Descrição' field='description' />
                <TableCell width={90} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                        </Box>
                    )}
                </TableCell>
            </Table>

            <UserContactsActionsDialog
                key={contacData?.id ?? String(toggleDialog)}
                actionType={actionType}
                actionData={contacData}
                open={toggleDialog}
                toggle={toggleContactDialog}
                personId={natualPerson.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default UserContactsTab
