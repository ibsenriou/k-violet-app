// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Hooks
// import useBgColor from '@core/hooks/useBgColor'
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from '@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import CircularProgress from '@mui/material/CircularProgress'
import useLoading from 'src/hooks/useLoading'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
    maxWidth: '48rem',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '35rem'
    }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 450
    }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        width: '100%'
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: 400
    }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

// const LinkStyled = styled('a')(({ theme }) => ({
//     fontSize: '0.875rem',
//     textDecoration: 'none',
//     color: theme.palette.primary.main
// }))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const schema = yup.object().shape({
    username: yup.string().required('Usuário é obrigatório'),
    password: yup.string().min(5, 'A senha deve ter pelo menos 5 caracteres').required('Senha é obrigatória')
})

interface FormData {
    username: string
    password: string
}

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // ** Hooks
    const [login, loadingLogin] = useLoading(useAuth().login)
    const theme = useTheme()
    const { settings } = useSettings()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    // ** Vars
    const { skin } = settings

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: FormData) => {
        const { username, password } = data
        login({ username, password }).catch(err => {
            console.error(err)
            setError('username', {
                type: 'manual',
                message: 'Usuário ou senha incorretos'
            })
        })
    }

    return (
        <Box className='content-right'>
            {!hidden ? (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <LoginIllustrationWrapper>
                        <LoginIllustration alt='login-illustration' src={`/images/fundo-${theme.palette.mode}.png`} />
                    </LoginIllustrationWrapper>
                    <FooterIllustrationsV2 />
                </Box>
            ) : null}
            <RightWrapper
                sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}
            >
                <Box
                    sx={{
                        p: 12,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.paper'
                    }}
                >
                    <BoxWrapper>
                        <Box
                            sx={{
                                top: 30,
                                left: 40,
                                display: 'flex',
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img width={50} src={`/images/logos/Logo-${theme.palette.mode}.png`} alt="Logo" />
                            <Typography
                                variant='h6'
                                sx={{
                                    ml: 3,
                                    lineHeight: 1,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '1.5rem !important'
                                }}
                            >
                                {themeConfig.templateName}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 6 }}>
                            <TypographyStyled variant='h5'>
                                Bem-Vindo ao {themeConfig.templateName}! 👋🏻
                            </TypographyStyled>
                            <Typography variant='body2'>Por favor acesse sua conta</Typography>
                        </Box>
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='username'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            autoFocus
                                            label='Usuário'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={Boolean(errors.username)}
                                        />
                                    )}
                                />
                                {errors.username && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.username.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                    Senha
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <OutlinedInput
                                            value={value}
                                            onBlur={onBlur}
                                            label='Senha'
                                            onChange={onChange}
                                            id='auth-login-v2-password'
                                            error={Boolean(errors.password)}
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Box
                                sx={{
                                    mb: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <FormControlLabel control={<Checkbox />} label='Lembrar Credencial' />
                                {/* <Link passHref href='/forgot-password'>
                                    <LinkStyled>Esqueceu a senha?</LinkStyled>
                                </Link> */}
                            </Box>
                            <Button
                                fullWidth
                                size='large'
                                type='submit'
                                variant='contained'
                                sx={{ marginBottom: 7 }}
                                startIcon={
                                    loadingLogin && (
                                        <CircularProgress
                                            sx={{
                                                '& .MuiCircularProgress-svg': {
                                                    color:
                                                        theme.palette.mode === 'light'
                                                            ? '#272727'
                                                            : theme.palette.grey[900]
                                                }
                                            }}
                                            size={20}
                                        />
                                    )
                                }
                                disabled={loadingLogin}
                            >
                                Login
                            </Button>
                        </form>
                    </BoxWrapper>
                </Box>
            </RightWrapper>
        </Box>
    )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
