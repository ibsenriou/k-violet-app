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

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import EmployeeActionsDialog from './detail/EmployeeActionsDialog'

import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'

import Workdays from '@core/utils/workdays'

import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import { DataParams } from '@core/components/table/types'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import { usePermission } from 'src/context/PermissionContext'

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

interface EmployeeData extends Person {
    working_week_days: string[]
}

const CommercialViewTabEmployees = () => {
    const [employeeData, setEmployeeData] = useState<EmployeeData>()
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete' | 'view' | null>(null)
    const [toggleDialog, setToggleDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const toggleEmployeeDialog = () => setToggleDialog(!toggleDialog)
    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    const store = useSelector((state: RootState) => state.commercialDetail)
    const { commercial } = store.data

    const employeesQuery = useQuery({
        queryKey: ['commercial.employees', commercial.id],
        queryFn: () => CondominiumService.commercialId_employees
          .get({ commercialId: commercial.id })
          .then(response => response.data)
    })

    const employees = employeesQuery.data?.results ?? []

    const employeesSorted = [...employees].sort((a, b) => a.name.localeCompare(b.name))

    const setActionTypeHandler = (actionType: 'add' | 'edit' | 'delete' | 'view', employee?: any) => {
        setEmployeeData(employee)
        setActionType(actionType)
        setToggleDialog(true)
    }

    const permissions = usePermission('condominium.commercial', { commercialId: commercial.id })

    const canAddEmployee = permissions.can('employees:create')
    const canViewEmployee = permissions.can('employees:retrieve')
    const canUpdateEmployee = permissions.can('employees:update')
    const canDeleteEmployee = permissions.can('employees:delete')

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='name'
                topRightActionLabel={canAddEmployee ? 'Adicionar Funcionário' : ''}
                topRightActionCallback={() => setActionTypeHandler('add')}
                title='Buscar Funcionário'
                data={employeesSorted ?? []}
                noRowsMessage='Este comercial não possui funcionários cadastrados.'
                noRowsFilterMessage='Nenhum funcionário cadastrado.'
            >
                <TableCell align='left' header='Funcionário' field='name'>
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

                <TableCell
                    align='left'
                    header='Dias de Trabalho'
                    field='working_week_days'
                    formatType='workingWeekDays'
                />

                <TableCell width={120} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<any>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {canViewEmployee && (
                            <IconButton onClick={() => setActionTypeHandler('view', row)}>
                                <EyeOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canUpdateEmployee && (
                            <IconButton onClick={() => setActionTypeHandler('edit', row)}>
                                <PencilOutline fontSize='small' />
                            </IconButton>
                            )}
                            {canDeleteEmployee && (
                            <IconButton onClick={() => setActionTypeHandler('delete', row)}>
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                            )}
                        </Box>
                    )}
                </TableCell>
            </Table>

            <EmployeeActionsDialog
                key={`${employeeData?.id}-${String(toggleDialog)}`}
                actionType={actionType}
                actionData={employeeData}
                open={toggleDialog}
                toggle={toggleEmployeeDialog}
                commercialId={commercial?.id}
            />

            <SnackbarAlert open={snackbarOpen} toggle={toggleSnackbarHandler} />
        </Card>
    )
}

export default CommercialViewTabEmployees
