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

import useService from 'src/hooks/useService'

import VehiclesActionsDialog from './detail/VehiclesActionsDialog'

import { VehicleType } from '@typesApiMapping/apps/vehicles/vehicleTypes'

import { CoreService } from 'src/services/coreService'
import { VehiclesService } from 'src/services/vehiclesService'
import { DataParams } from '@core/components/table/types'
import { usePermission } from 'src/context/PermissionContext'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'

const ResidentialViewTabVehicles = () => {
    const [vehicleData, setVehicleData] = useState<VehicleType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleVehicleDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.residentialDetail)
    const { residential } = store.data

    const vehiclesQuery = useQuery({
      queryKey: ['residential.garages', residential.id],
      queryFn: () =>
          CondominiumService.residentialId_vehicles
              .get({ residentialId: residential.id })
              .then(response => response.data)
  })
  const vehicles = vehiclesQuery.data?.results ?? []

    const { find: findColor } = useService(CoreService.color)
    const { find: findManufacturer } = useService(VehiclesService.vehicle_manufacturer)
    const { find: findModel } = useService(VehiclesService.vehicle_model)

    const vehiclesSorted = [...vehicles].sort((a, b) => a.vehicle_plate.localeCompare(b.vehicle_plate))

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', vehicle?: VehicleType) => {
        setVehicleData(vehicle)
        setActionType(actionType)
        setToggleDialog(true)
    }


    const residentialId = useAppSelector((state: RootState) => state.residentialDetail.data.id) as string
    const permissions = usePermission('condominium.residential', { residentialId: residentialId })

    const canAddVehicle = permissions.can('vehicles:create')
    const canViewVehicle = permissions.can('vehicles:retrieve')
    const canUpdateVehicle = permissions.can('vehicles:update')
    const canDeleteVehicle = permissions.can('vehicles:delete')


    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='vehicle_plate'
                topRightActionLabel={canAddVehicle ? 'Adicionar Veículo' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Veículo'
                data={vehiclesSorted ?? []}
                noRowsMessage='Este residencial não possui veículos cadastrados.'
                noRowsFilterMessage='Nenhum veículo cadastrado.'
                loading={vehiclesQuery.isLoading}
            >
                <TableCell
                    align='left'
                    header='Placa'
                    field='vehicle_plate'
                    format={(vehicle_plate: string) => vehicle_plate.replace(/(\w{3})(\w{4})/, '$1-$2')}
                />
                <TableCell
                    align='left'
                    header='Fabricante'
                    field='fk_vehicle_model'
                    format={vehicle => findManufacturer(findModel(vehicle)?.fk_vehicle_manufacturer)?.description}
                />
                <TableCell
                    align='left'
                    header='Modelo'
                    field='fk_vehicle_model'
                    format={vehicle => findModel(vehicle)?.description}
                />
                <TableCell
                    align='left'
                    header='Cor'
                    field='fk_color'
                    format={vehicle => findColor(vehicle)?.description}
                />
                <TableCell width={135} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewVehicle && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canUpdateVehicle && (
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeleteVehicle && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <VehiclesActionsDialog
                key={vehicleData?.id}
                actionType={actionType}
                actionData={vehicleData}
                open={toggleDialog}
                toggle={toggleVehicleDialog}
                residentialId={residential.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default ResidentialViewTabVehicles
