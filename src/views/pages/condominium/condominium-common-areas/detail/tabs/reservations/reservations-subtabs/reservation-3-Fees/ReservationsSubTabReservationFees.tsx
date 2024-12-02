// ** React Imports
import { useState } from 'react'

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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// ** Custom Components

// ** SysCondo Components
import ReservationsSubTabReservationFeesActionDialog from './ReservationsSubTabReservationFeesActionDialog'

const ReservationsSubTabReservationFees = () => {
    //** State */
    const [addNewValueOpen, setAddNewValueOpen] = useState(false)

    const [snackbarOpen, setSnackbarOpen] = useState(false)

    //** Store */
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const { commonAreaUtilizationFeeHistories } = store

    //** Togglers */
    const toggleAddNewValueDialog = () => setAddNewValueOpen(!addNewValueOpen)

    return (
        <Card sx={{ marginBottom: 6 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <CardHeader title='Histórico de Valor de Taxa de Reserva' titleTypographyProps={{ variant: 'h6' }} />
                <Button sx={{ marginRight: 3 }} variant='contained' onClick={() => setAddNewValueOpen(true)}>
                    Adicionar Novo Valor
                </Button>
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
                            <TableCell sx={{ height: '3.375rem' }}>Valor</TableCell>
                            <TableCell sx={{ height: '3.375rem' }}>Válido Desde</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(commonAreaUtilizationFeeHistories.length > 0 &&
                            commonAreaUtilizationFeeHistories.map(item => (
                                <TableRow hover key={item.id} sx={{ '&:last-of-type td': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant='body2'>
                                            {
                                                // Convert String  String Item Value to Fixed 2 Decimal Places With Currency
                                                new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(parseFloat(item.value))
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant='body2'>
                                            {new Date(item.date_since_its_valid).toLocaleDateString('pt-BR')}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))) || (
                            <TableRow>
                                <TableCell>
                                    Esta área comum não possui histórico de valores de taxa de reserva cadastrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ReservationsSubTabReservationFeesActionDialog open={addNewValueOpen} toggle={toggleAddNewValueDialog} />
        </Card>
    )
}

export default ReservationsSubTabReservationFees
