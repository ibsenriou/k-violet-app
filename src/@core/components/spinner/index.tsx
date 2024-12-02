// ** MUI Import
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

const FallbackSpinner = () => {
    // ** Hook
    const theme = useTheme()

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            {' '}
            <img width={100} height={100} src={`/images/logos/Logo-${theme.palette.mode}.png`} />
            <CircularProgress disableShrink sx={{ mt: 6 }} />
        </Box>
    )
}

export default FallbackSpinner
