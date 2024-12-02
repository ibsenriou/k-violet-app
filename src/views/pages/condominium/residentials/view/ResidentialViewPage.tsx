import Grid from '@mui/material/Grid'

import ResidentialViewLeft from 'src/views/pages/condominium/residentials/view/ResidentialViewLeft'
import ResidentialViewRight from 'src/views/pages/condominium/residentials/view/ResidentialViewRight'

const ResidentialViewPage = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
                <ResidentialViewLeft />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <ResidentialViewRight />
            </Grid>
        </Grid>
    )
}

export default ResidentialViewPage
