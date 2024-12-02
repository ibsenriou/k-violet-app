// ** React Imports
import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState, useAppDispatch } from 'src/store'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Custom Components
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'

// ** SysCondo Components
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import CalendarOutline from 'mdi-material-ui/CalendarOutline'
import Close from 'mdi-material-ui/Close'

import FallbackSpinner from '@core/components/spinner'
import { fetchData as fetchResidentials } from 'src/store/apps/condominium/residentials'
import { DataParams } from '@core/components/table/types'

// ** Custom Styles
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface ReservationType {
    reservation_date: string
    fk_uhab_as_reservant: string
}

const ReservationsSubTabReservationHistory = () => {
    //** State */
    const [viewDialogueOpen, setviewDialogueOpen] = useState(false)

    const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null)

    const residentials = useSelector((state: RootState) => state.residentials.residentials)

    //** Store */
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const { commonAreaReservations } = store

    const handleDialogClose = () => {
        setviewDialogueOpen(false)
        setSelectedReservation(null)
    }

    const handleSelectReservation = (reservation: ReservationType) => {
        setSelectedReservation(reservation)
        setviewDialogueOpen(true)
    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchResidentials())
    }, [dispatch])

    if (!residentials) {
        return <FallbackSpinner />
    }

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Table
                searchField='all'
                title='Buscar Histórico de Reservas'
                data={commonAreaReservations ?? []}
                noRowsMessage='Esta área comum não possui histórico de reserva cadastrados.'
                noRowsFilterMessage='Nenhuma reserva encontrada.'
            >
                <TableCell align='left' header='Data de Reserva' field='reservation_date' formatType='date' />
                <TableCell
                    align='left'
                    header='Responsável'
                    field='fk_uhab_as_reservant'
                    format={fk_uhab_as_reservant =>
                        residentials.find(residential => residential.id === fk_uhab_as_reservant)?.name ||
                        'Não Encontrada'
                    }
                />
                <TableCell width={90} align='center' header='Ações' field='actions'>
                    {({ row }: DataParams<ReservationType>) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => handleSelectReservation(row)}>
                                <CalendarOutline fontSize='small' />
                            </IconButton>
                        </Box>
                    )}
                </TableCell>
            </Table>

            {selectedReservation && (
                <Dialog
                    open={viewDialogueOpen}
                    onClose={handleDialogClose}
                    fullWidth
                    maxWidth='md'
                    scroll='body'
                    TransitionComponent={Transition}
                    onBackdropClick={() => handleDialogClose()}
                >
                    <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                        <IconButton
                            size='small'
                            onClick={() => handleDialogClose()}
                            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                        >
                            <Close />
                        </IconButton>

                        <Box sx={{ mb: 8, textAlign: 'center' }}>
                            <Typography variant='h5' sx={{ mb: 3 }}>
                                Visualizar Reserva
                            </Typography>
                            <Typography variant='body2'>Visualize os detalhes da reserva.</Typography>
                        </Box>

                        <Grid container spacing={6}>
                            <Grid item sm={12} xs={12}>
                                <FormControl fullWidth sx={{ mb: 6 }}>
                                    <InputLabel id='title'>Unidade Reservante</InputLabel>
                                    <Select
                                        disabled
                                        label='Unidade Reservante'
                                        value={selectedReservation.fk_uhab_as_reservant}
                                        labelId='Unidade-Reservante'
                                        required
                                    >
                                        {residentials &&
                                            residentials.map(residencial => {
                                                return (
                                                    <MenuItem key={residencial.id} value={residencial.id}>
                                                        Residencial {residencial.name}
                                                    </MenuItem>
                                                )
                                            })}
                                    </Select>
                                </FormControl>
                                <Box sx={{ mb: 80 }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            disabled
                                            type='date'
                                            label='Data da Reserva'
                                            value={selectedReservation.reservation_date}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    )
}

export default ReservationsSubTabReservationHistory
