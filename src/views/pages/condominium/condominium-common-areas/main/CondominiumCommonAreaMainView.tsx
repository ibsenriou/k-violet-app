// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Component Imports
import CondominiumCommonAreaRightContainer from './CondominiumCommonAreaRightContainer'
import CondominiumCommonAreaLeftContainer from './CondominiumCommonAreaLeftContainer'

/* This is the main container for the condominium common area view page.

    The page is divided in two parts: the left side and the right side.
    The left side contains a card with the principal information about the condominium common area.
    the right side contains tabs containing details about the condominium common area configurations, including tables, etc.
*/
const CondominiumCommonAreaMainView = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
                <CondominiumCommonAreaLeftContainer />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <CondominiumCommonAreaRightContainer />
            </Grid>
        </Grid>
    )
}

export default CondominiumCommonAreaMainView
