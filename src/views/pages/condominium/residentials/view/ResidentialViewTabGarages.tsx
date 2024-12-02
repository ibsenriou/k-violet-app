import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, useAppSelector } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import GarageActionsDialog from './detail/GarageActionsDialog'

import { GarageType } from '@typesApiMapping/apps/condominium/garageTypes'
import { DataParams } from '@core/components/table/types'
import { usePermission } from 'src/context/PermissionContext'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'

const ResidentialViewTabGarages = () => {
    const [garageData, setGarageData] = useState<GarageType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleGarageDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.residentialDetail)
    const { residential } = store.data

    const garagesQuery = useQuery({
      queryKey: ['residential.garages', residential.id],
      queryFn: () =>
          CondominiumService.residentialId_garage
              .get({ residentialId: residential.id })
              .then(response => response.data)
    })
    const garage = garagesQuery.data?.results ?? []

    const garagesSorted = [...garage].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    )

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', garage?: GarageType) => {
        setGarageData(garage)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const permissions = usePermission('condominium.residential', { residentialId: residential.id })

    const canAddGarage = permissions.can('garages:create')
    const canViewGarage = permissions.can('garages:retrieve')
    const canUpdateGarage = permissions.can('garages:update')
    const canDeleteGarage = permissions.can('garages:delete')


    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='name'
                topRightActionLabel={canAddGarage ? 'Adicionar Garagem' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Garagem'
                data={garagesSorted ?? []}
                noRowsMessage='Este residencial não possui garagens cadastradas.'
                noRowsFilterMessage='Nenhuma garagem cadastrada.'
                loading={garagesQuery.isLoading}
            >
                <TableCell align='left' header='Nome' field='name' />
                <TableCell align='left' header='Vagas' field='number_of_spots' />
                <TableCell align='left' header='Em uso' field='is_garage_being_used' formatType='boolean' />
                <TableCell align='left' header='Locação' field='is_garage_available_for_rent' formatType='boolean' />
                <TableCell align='left' header='Gaveta' field='is_drawer_type_garage' formatType='boolean' />
                <TableCell align='left' header='Coberta' field='is_covered_type_garage' formatType='boolean' />
                <TableCell width={135} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewGarage && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canUpdateGarage && (
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeleteGarage && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <GarageActionsDialog
                key={garageData?.id}
                actionType={actionType}
                actionData={garageData}
                open={toggleDialog}
                toggle={toggleGarageDialog}
                residentialId={residential.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default ResidentialViewTabGarages
