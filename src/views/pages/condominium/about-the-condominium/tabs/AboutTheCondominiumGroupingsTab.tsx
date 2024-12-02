import { useContext, useState } from 'react'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'

import useService from 'src/hooks/useService'

import { LookupsService } from 'src/services/lookupsService'

import AboutTheCondominiumGroupingsActionsDialog from './AboutTheCondominiumGroupingsActionsDialog'
import { DataParams } from '@core/components/table/types'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const AboutTheCondominiumGroupingsTab = () => {
    const [groupingData, setGroupingData] = useState<CondominiumGroupingType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleGroupingDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const { find: findCondominiumGroupingType } = useService(LookupsService.lookup_type_of_condominium_grouping)
    const findCondominiumGroupingDescription = (fk_lookup_type_of_condominium_grouping: string) =>
        findCondominiumGroupingType(fk_lookup_type_of_condominium_grouping)?.description

    const store = useSelector((state: RootState) => state.aboutTheCondominium)
    const { groupings } = store.data

    const condominiumId = store.data.condominium.id
    const condominiumGroupings = groupings.filter(grouping => grouping.fk_uhab === condominiumId)

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', grouping?: any) => {
        setGroupingData(grouping)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const ability = useContext(AbilityContext)

    return (
        <Card>
            <Table
                searchField='name'
                topRightActionCallback={() => setActionTypeHandler('add')}
                topRightActionLabel={'Adicionar Agrupamento'}
                title='Buscar Agrupamento'
                data={condominiumGroupings ?? []}
                noRowsMessage='Este condomínio não possui agrupamentos cadastrados.'
                noRowsFilterMessage='Nenhum agrupamento encontrado.'
            >
                <TableCell
                    align='left'
                    header='Tipo de Agrupamento'
                    field='fk_lookup_type_of_condominium_grouping'
                    format={findCondominiumGroupingDescription}
                />
                <TableCell align='left' header='Nome' field='name' />
                <TableCell align='left' header='Descrição' field='description' />
                <TableCell width={90} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                        </Box>
                    )}
                </TableCell>
            </Table>

            <AboutTheCondominiumGroupingsActionsDialog
                key={groupingData?.id ?? String(toggleDialog)}
                actionType={actionType}
                actionData={groupingData}
                open={toggleDialog}
                toggle={toggleGroupingDialog}
                condominiumId={condominiumId}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default AboutTheCondominiumGroupingsTab
