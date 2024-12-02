import Grid from '@mui/material/Grid'
import UserOccurrencesViewLeft from './components/details/UserOccurrencesViewLeft'
import UserOccurrencesViewRight from './components/details/UserOccurrencesViewRight'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import { useRouter } from 'next/router'


const UserOccurrencesViewPage = () => {
    const router = useRouter()
    const { occurrenceId } = router.query as { occurrenceId: string }

    const userOccurrenceQuery = useQuery({
      queryKey: ['userOccurrence', occurrenceId],
      queryFn: () => {
          return CondominiumService.condominium_user_occurrenceId.get({ userOccurrenceId: occurrenceId })
      },
      select: response => response.data
    })

    if (!userOccurrenceQuery.data) {
        return null
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
                <UserOccurrencesViewLeft />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <UserOccurrencesViewRight />
            </Grid>
        </Grid>
    )
}

export default UserOccurrencesViewPage
