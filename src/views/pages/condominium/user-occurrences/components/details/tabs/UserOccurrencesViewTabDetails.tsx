








import { CardContent, Grid, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { CondominiumService } from 'src/services/condominiumService'


const UserOccurrencesViewTabDetails = () => {

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

  const userOccurrence = userOccurrenceQuery.data

    return (
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  value={userOccurrence.title}
                  label="Título"
                  placeholder='Título'
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField
                  disabled
                  fullWidth
                  multiline
                  rows={12}
                  value={userOccurrence.description}
                  label="Tipo"
                  placeholder='Tipo'
                />
              </Grid>

            </Grid>
          </CardContent>

    )
}

export default UserOccurrencesViewTabDetails
