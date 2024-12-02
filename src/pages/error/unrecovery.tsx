// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from '@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        width: '90vw'
    }
}))

const Img = styled('img')(({ theme }) => ({
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
        height: 450,
        marginTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
        height: 400
    },
    [theme.breakpoints.up('lg')]: {
        marginTop: theme.spacing(13)
    }
}))

const Unrecovery = () => {
    const auth = useAuth()

    return (
        <Box className='content-center'>
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <BoxWrapper>
                    <Typography variant='h1'>Erro</Typography>
                    <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
                        Não foi possível consultar o servidor!
                    </Typography>
                    <Typography variant='body2'>Encontramos um erro, entre em contato com o Suporte.</Typography>
                </BoxWrapper>
                <Img height='487' alt='error-illustration' src='/images/pages/401.png' />
                <Button variant='contained' sx={{ px: 5.5 }} onClick={auth.logout}>
                    Sair
                </Button>
            </Box>
            <FooterIllustrations />
        </Box>
    )
}

Unrecovery.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Unrecovery
