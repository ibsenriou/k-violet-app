import { useContext, useState } from 'react'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import AboutTheCondominiumContactsActionsDialog from './AboutTheCondominiumContactsActionsDialog'

import { CondominiumContactInformationType } from '@typesApiMapping/apps/condominium/condominiumContactInformationTypes'

import useService from 'src/hooks/useService'
import { LookupsService } from 'src/services/lookupsService'
import { DataParams } from '@core/components/table/types'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import usePermissionActionButtons from 'src/hooks/usePermissionActionButtons'

const AboutTheCondominiumContactsTab = () => {
    const [contacData, setContactData] = useState<CondominiumContactInformationType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleContactDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const { find: findContactInformationType } = useService(LookupsService.lookup_type_of_contact_information)
    const findContactInformationDescription = (fk_lookup_type_of_contact_information: string) =>
        findContactInformationType(fk_lookup_type_of_contact_information)?.description

    const store = useSelector((state: RootState) => state.aboutTheCondominium)
    const { contactInformation } = store.data
    const condominiumId = store.data.condominium.id

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', contact?: any) => {
        setContactData(contact)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const ability = useContext(AbilityContext)

    return (
        <Card>
            <Table
                searchField='contact'
                topRightActionCallback={() => setActionTypeHandler('add')}
                topRightActionLabel={'Adicionar Contato'}
                title='Buscar Contato'
                data={contactInformation ?? []}
                noRowsMessage='Este condomínio não possui contatos cadastrados.'
                noRowsFilterMessage='Nenhum contato encontrado.'
            >
                <TableCell
                    align='left'
                    header='Tipo de Contato'
                    field='fk_lookup_type_of_contact_information'
                    format={findContactInformationDescription}
                />
                <TableCell align='left' header='Contato' field='contact' />
                <TableCell align='left' header='Descrição' field='description' />
                <TableCell width={135} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {usePermissionActionButtons('about-the-condominium-page', row, setActionTypeHandler)}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <AboutTheCondominiumContactsActionsDialog
                key={contacData?.id ?? String(toggleDialog)}
                actionType={actionType}
                actionData={contacData}
                open={toggleDialog}
                toggle={toggleContactDialog}
                condominiumId={condominiumId}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default AboutTheCondominiumContactsTab
