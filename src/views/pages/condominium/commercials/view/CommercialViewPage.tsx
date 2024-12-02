import Grid from '@mui/material/Grid'

import CommercialViewLeft from 'src/views/pages/condominium/commercials/view/CommercialViewLeft'
import CommercialViewRight from 'src/views/pages/condominium/commercials/view/CommercialViewRight'

const CommercialViewPage = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
                <CommercialViewLeft />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <CommercialViewRight />
            </Grid>
        </Grid>
    )
}

export default CommercialViewPage
