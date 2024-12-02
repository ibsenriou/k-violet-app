

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/avatar'
import CustomChip from '@core/components/mui/chip'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import { UserOccurrencePrivacyOptions, UserOccurrenceStatusOptions } from '../../enums'
import formatter from '@core/utils/formatter'


const UserOccurrencesViewLeft = () => {
    const router = useRouter()
    const { occurrenceId } = router.query as { occurrenceId: string }

    const userOccurrenceQuery = useQuery({
      queryKey: ['userOccurrence', occurrenceId],
      queryFn: () => {
          return CondominiumService.condominium_user_occurrenceId.get({ userOccurrenceId: occurrenceId })
      },
      select: response => response.data
    })

    const date = formatter('date')

    if (!userOccurrenceQuery.data) {
        return null
    }

    const userOccurrence = userOccurrenceQuery.data

    const renderUserAvatar = () => {
        return (
            <CustomAvatar
                skin='light'
                variant='rounded'
                color={'success'}
                sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
            >
                !
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
                        <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                            <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                {`Ocorrência`}
                            </Typography>
                            {/* <Typography variant='body2'>{userOccurrence.lookup_type_of_condominium_user_occurrence}</Typography> */}
                        </Box>
                        <CustomChip
                            skin='light'
                            size='small'
                            label={userOccurrence.lookup_type_of_condominium_user_occurrence}
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
                                    Responsável:
                                </Typography>
                                <Typography variant='body2'>
                                  { userOccurrence.created_by_name }
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Status:
                                </Typography>
                                <Typography variant='body2'>
                                  { UserOccurrenceStatusOptions[userOccurrence.current_status] }
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Privacidade:
                                </Typography>
                                <Typography variant='body2'>
                                  { UserOccurrencePrivacyOptions[userOccurrence.privacy] }
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Tipo:
                                </Typography>
                                <Typography variant='body2'>
                                  { userOccurrence.lookup_type_of_condominium_user_occurrence }
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Data de Abertura:
                                </Typography>
                                <Typography variant='body2'>
                                  { date(userOccurrence.created_at) }
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Data de Conclusão:
                                </Typography>
                                <Typography variant='body2'>
                                  { userOccurrence.conclusion_date ? date(userOccurrence.conclusion_date) : '-' }
                                </Typography>
                            </Box>


                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default UserOccurrencesViewLeft
