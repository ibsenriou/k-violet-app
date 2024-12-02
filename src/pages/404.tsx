// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from '@core/layouts/BlankLayout'

// ** Demo Imports

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

const Error404 = () => {
    return (
        <Box className='content-center'>
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <BoxWrapper>
                    <Typography variant='h1'>404</Typography>
                    <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
                        Página não encontrada ⚠️
                    </Typography>
                    <Typography variant='body2'>Não encontramos a página que você procura.</Typography>
                </BoxWrapper>
                <Img height='487' alt='error-illustration' src='/images/pages/404.png' />
                <Link passHref href='/'>
                    <Button component='a' variant='contained' sx={{ px: 5.5 }}>
                        Voltar a tela inicial
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error404
