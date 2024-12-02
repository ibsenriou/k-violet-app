import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, useAppSelector } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import useService from 'src/hooks/useService'

import PetActionsDialog from './detail/PetActionsDialog'

import { PetType } from '@typesApiMapping/apps/pets/petTypes'

import { CoreService } from 'src/services/coreService'
import { PetsService } from 'src/services/petsService'

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

const ResidentialViewTabPets = () => {
    const [petData, setPetData] = useState<PetType>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const togglePetDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.residentialDetail)
    const { residential } = store.data

    const petsQuery = useQuery({
      queryKey: ['residential.pets', residential.id],
      queryFn: () =>
          CondominiumService.residentialId_pets
              .get({ residentialId: residential.id })
              .then(response => response.data)
  })
  const pets = petsQuery.data?.results ?? []

    const { find: findColor } = useService(CoreService.color)
    const { find: findSize } = useService(PetsService.animal_size)
    const { find: findBreed } = useService(PetsService.animal_breed)
    const { find: findSpecie } = useService(PetsService.animal_species)

    const petsSorted = [...pets].sort((a, b) => a.name.localeCompare(b.name))

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', pet?: PetType) => {
        setPetData(pet)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const residentialId = useAppSelector((state: RootState) => state.residentialDetail.data.id) as string
    const permissions = usePermission('condominium.residential', { residentialId: residentialId })

    const canAddPet = permissions.can('pets:create')
    const canViewPet = permissions.can('pets:retrieve')
    const canUpdatePet = permissions.can('pets:update')
    const canDeletePet = permissions.can('pets:delete')


    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='name'
                topRightActionLabel={canAddPet ? 'Adicionar Pet' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Pet'
                data={petsSorted ?? []}
                noRowsMessage='Este residencial não possui pets cadastrados.'
                noRowsFilterMessage='Nenhum pet cadastrado.'
            >
                <TableCell align='left' header='Nome' field='name'>
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

                <TableCell
                    align='left'
                    header='Espécie'
                    field='fk_animal_breed'
                    format={pet => findSpecie(findBreed(pet)?.fk_animal_species)?.description}
                />
                <TableCell
                    align='left'
                    header='Raça'
                    field='fk_animal_breed'
                    format={pet => findBreed(pet)?.description}
                />
                <TableCell
                    align='left'
                    header='Porte'
                    field='fk_animal_size'
                    format={pet => findSize(pet)?.description}
                />
                <TableCell
                    align='left'
                    header='Cor'
                    field='fk_animal_color'
                    format={pet => findColor(pet)?.description}
                />

                <TableCell width={135} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewPet && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canUpdatePet && (
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeletePet && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <PetActionsDialog
                key={petData?.id}
                actionType={actionType}
                actionData={petData}
                open={toggleDialog}
                toggle={togglePetDialog}
                residentialId={residential.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default ResidentialViewTabPets
