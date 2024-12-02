import { useSelector } from 'react-redux'

import { RootState } from 'src/store'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/avatar'
import CustomChip from '@core/components/mui/chip'

import useService from 'src/hooks/useService'

import { LookupsService } from 'src/services/lookupsService'
import { useFindResidentialGroupName } from 'src/store/apps/condominium/residentials'
import { getInitials } from '@core/utils/get-initials'

const ResidentialViewLeft = () => {
    const store = useSelector((state: RootState) => state.residentialDetail)
    const condominium = useSelector((state: RootState) => state.aboutTheCondominium)

    const { find: findResidentialType } = useService(LookupsService.lookup_type_of_residential)
    const findResidentialGroupName = useFindResidentialGroupName()

    const name = store.data.residential.name
    const condominiumName = condominium.data.condominium.name

    const groupName = findResidentialGroupName(store.data.residential.id)
    const descriptionTypeOfResidential = findResidentialType(
        store.data.residential.fk_lookup_type_of_residential
    )?.description

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
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardContent
                        sx={{ paddingTop: 15, display: 'flex', alignItems: 'center', flexDirection: 'column', height: '40rem'}}
                    >
                        {renderUserAvatar()}
                        <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                            <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                {descriptionTypeOfResidential}:
                            </Typography>
                            <Typography variant='body2'>{name}</Typography>
                        </Box>
                        <CustomChip
                            skin='light'
                            size='small'
                            label={condominiumName == groupName ? condominiumName : condominiumName + ' - ' + groupName}
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

                    {/* <CardContent>
                        <Typography variant='h6'>Detalhes</Typography>
                        <Divider />
                        <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Proprietários:
                                </Typography>
                                <Typography variant='body2'>{proprietariesLength}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Moradores:
                                </Typography>
                                <Typography variant='body2'>{residentsLength}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Funcionários:
                                </Typography>
                                <Typography variant='body2'>{employeesLength}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Garagens:
                                </Typography>
                                <Typography variant='body2'>{garageLength}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Veículos:
                                </Typography>
                                <Typography variant='body2'>{vehiclesLength}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginBottom: 2.7 }}>
                                <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                    Pets:
                                </Typography>
                                <Typography variant='body2'>{petsLength}</Typography>
                            </Box>
                        </Box>
                    </CardContent> */}
                </Card>
            </Grid>
        </Grid>
    )
}

export default ResidentialViewLeft
