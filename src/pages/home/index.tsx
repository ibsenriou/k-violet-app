// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// const Img = styled('img')(({ theme }) => ({
//     marginBottom: theme.spacing(10),
//     [theme.breakpoints.down('lg')]: {
//         height: 450,
//         marginTop: theme.spacing(10)
//     },
//     [theme.breakpoints.down('md')]: {
//         height: 400
//     },
//     [theme.breakpoints.up('lg')]: {
//         marginTop: theme.spacing(13)
//     }
// }))

const Home = () => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                height: 'calc(100vh - 64px - 110px)',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <img height='100%' style={{ maxHeight: '500px' }} src={`/images/fundo-${theme.palette.mode}.png`} alt="Background" />
        </Box>
    )
}

Home.acl = {
  action: 'read',
  subject: 'home-page'
}

export default Home
