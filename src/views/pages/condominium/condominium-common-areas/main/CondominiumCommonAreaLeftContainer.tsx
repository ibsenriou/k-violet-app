// ** React Imports

// Redux Imports
import { useSelector } from 'react-redux'

// Redux Store
import { RootState } from 'src/store'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components
import CustomAvatar from '@core/components/mui/avatar'
import CustomChip from '@core/components/mui/chip'

// ** Utils Import
import { getInitials } from '@core/utils/get-initials'
import Workdays from '@core/utils/workdays'

const CondominiumCommonAreaLeftContainer = () => {
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    const { commonArea } = store

    const {
        name,
        description,
        capacity_of_people,
        does_it_requires_reservation,
        does_it_have_usage_fee,
        does_it_allows_guests,
        does_it_allows_reservation_to_defaulters,
        does_it_have_entry_checklist,
        does_it_have_exit_checklist,
        working_week_days
    } = commonArea

    const abreviatedWorkingWeekDays = new Workdays(working_week_days).getAbbreviatedDaysByBinary().join(', ')

    const renderUserAvatar = () => {
        return (
            <CustomAvatar
                skin='light'
                variant='rounded'
                color={'success'}
                sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
            >
                {getInitials(name)}
            </CustomAvatar>
        )
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardContent
                        sx={{ paddingTop: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                    >
                        {renderUserAvatar()}
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                            {name}
                        </Typography>
                        <CustomChip
                            skin='light'
                            size='small'
                            label={description}
                            sx={{
                                height: 20,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                borderRadius: '5px',
                                textTransform: 'capitalize',
                                '& .MuiChip-label': { mt: -0.25 }
                            }}
                        />
                    </CardContent>

                    <CardContent>
                        <Typography variant='h6'>Detalhes</Typography>
                        <Divider />
                        <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Capacidade:
                                </Typography>
                                <Typography variant='body2'>{capacity_of_people} Pessoas</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Reserva:
                                </Typography>
                                <Typography variant='body2'>
                                    {(does_it_requires_reservation && 'Uso Mediante Reserva ') || 'Uso Livre'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Taxa de Utilização:
                                </Typography>
                                <Typography variant='body2'>{(does_it_have_usage_fee && 'Sim') || 'Não'}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Permite Convidados:
                                </Typography>
                                <Typography variant='body2'>{(does_it_allows_guests && 'Sim') || 'Não'}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Permite Reserva de Inadimplentes:
                                </Typography>
                                <Typography variant='body2'>
                                    {(does_it_allows_reservation_to_defaulters && 'Sim') || 'Não'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Dias de Funcionamento:
                                </Typography>
                                <Typography variant='body2'>{abreviatedWorkingWeekDays}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default CondominiumCommonAreaLeftContainer
