// ** React Imports
import { useMemo, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState } from 'src/store'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

// ** Types Imports
import { CondominiumCommonAreaReservationPeriodType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationPeriodTypes'

// ** Custom Components
import ReservationPeriodActionsDialog from './ReservationsSubTabReservationPeriodActionDialog'

// ** Styles Imports
import FallbackSpinner from '@core/components/spinner'
import { removeSecondsFromTime } from '@core/utils/format'

const ReservationsSubTabReservationsPeriod = () => {
    // ** Redux State
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const { commonAreaReservationPeriods } = store

    // ** Action Dialog Controllers
    const [actionType, setActionType] = useState<'add' | 'delete'>('add')
    const [actionData, setActionData] = useState<CondominiumCommonAreaReservationPeriodType>()

    const [
        CondominiumCommonAreaReservationPeriodActionsDialogOpen,
        setCondominiumCommonAreaReservationPeriodActionsDialogOpen
    ] = useState<boolean>(false)

    const toggleCondominiumCommonAreaReservationPeriodActionsDialog = () =>
        setCondominiumCommonAreaReservationPeriodActionsDialogOpen(
            !CondominiumCommonAreaReservationPeriodActionsDialogOpen
        )

    const handleCondominiumCommonAreaItemAction = (
        type: 'add' | 'delete',
        row: CondominiumCommonAreaReservationPeriodType | undefined = undefined
    ) => {
        setActionType(type)
        setActionData(row)
        toggleCondominiumCommonAreaReservationPeriodActionsDialog()
    }

    const addCondominiumCommonAreaReservationPeriodHandler = () => handleCondominiumCommonAreaItemAction('add')
    const deleteCondominiumCommonAreaReservationPeriodHandler = (row: CondominiumCommonAreaReservationPeriodType) =>
        handleCondominiumCommonAreaItemAction('delete', row)

    const commonAreaAlreadyHasPeriodoDeReservaWithFullDay = useMemo(() => {
        const hasPeriodoDeReservaWithFullDay = commonAreaReservationPeriods.some(
            reservationPeriod => reservationPeriod.is_full_day
        )

        return hasPeriodoDeReservaWithFullDay
    }, [commonAreaReservationPeriods])

    const shouldDisableReservationDialog = useMemo(() => {
        if (commonAreaAlreadyHasPeriodoDeReservaWithFullDay) {
            return true
        }

        return false
    }, [commonAreaAlreadyHasPeriodoDeReservaWithFullDay])

    const reservationPeriodsSortedByStartTime = useMemo(() => {
        const commonAreaReservationPeriodsCopy = [...commonAreaReservationPeriods]
        const sortedReservationPeriods = commonAreaReservationPeriodsCopy.sort((a, b) => {
            const aStartTime = a.start_time.split(':')
            const bStartTime = b.start_time.split(':')

            if (aStartTime[0] < bStartTime[0]) {
                return -1
            }

            if (aStartTime[0] > bStartTime[0]) {
                return 1
            }

            if (aStartTime[1] < bStartTime[1]) {
                return -1
            }

            if (aStartTime[1] > bStartTime[1]) {
                return 1
            }

            return 0
        })

        return sortedReservationPeriods
    }, [commonAreaReservationPeriods])

    if (!store) {
        // Displays a spinner if the store is not yet populated with data.
        return <FallbackSpinner />
    }

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <CardHeader title='Períodos de Reserva' titleTypographyProps={{ variant: 'h6' }} />
                <Tooltip
                    title={
                        commonAreaAlreadyHasPeriodoDeReservaWithFullDay &&
                        'Você já possui um período de reserva integral cadastrado, por favor, remova-o para adicionar um novo período de reserva.'
                    }
                    placement='bottom'
                >
                    <span>
                        <Button
                            disabled={shouldDisableReservationDialog}
                            sx={{ marginRight: 3 }}
                            variant='contained'
                            onClick={addCondominiumCommonAreaReservationPeriodHandler}
                        >
                            Adicionar Novo Período
                        </Button>
                    </span>
                </Tooltip>
            </Box>
            <Divider sx={{ margin: 0 }} />
            <TableContainer>
                <Table size='small' sx={{ minWidth: 500 }}>
                    <TableHead
                        sx={{
                            backgroundColor: theme =>
                                theme.palette.mode === 'light' ? 'grey.50' : 'background.default'
                        }}
                    >
                        <TableRow>
                            <TableCell sx={{ height: '3.375rem', width: '80%' }}>Horário</TableCell>
                            <TableCell sx={{ height: '3.375rem', maxWidth: '50px' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(reservationPeriodsSortedByStartTime.length > 0 &&
                            reservationPeriodsSortedByStartTime.map(period => (
                                <TableRow hover key={period.id} sx={{ '&:last-of-type td': { border: 0 } }}>
                                    {period.is_full_day ? (
                                        <TableCell>
                                            <Typography variant='body2'>Período Integral</Typography>
                                        </TableCell>
                                    ) : (
                                        <TableCell>
                                            <Typography variant='body2'>
                                                {removeSecondsFromTime(period.start_time)} -{' '}
                                                {removeSecondsFromTime(period.end_time)}
                                            </Typography>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <IconButton
                                            onClick={() => deleteCondominiumCommonAreaReservationPeriodHandler(period)}
                                        >
                                            <DeleteOutline fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))) || (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    Esta área comum ainda não possui nenhum período de reserva cadastrado, por favor,
                                    cadastre um novo período para habilitar as reservas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ReservationPeriodActionsDialog
                actionType={actionType}
                actionData={actionData}
                open={CondominiumCommonAreaReservationPeriodActionsDialogOpen}
                toggle={toggleCondominiumCommonAreaReservationPeriodActionsDialog}
                numberOfPeriods={commonAreaReservationPeriods.length}
            />
        </Card>
    )
}

export default ReservationsSubTabReservationsPeriod
