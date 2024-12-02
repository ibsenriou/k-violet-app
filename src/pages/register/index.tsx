// ** React Imports
import { Fragment, MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
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
import Facebook from 'mdi-material-ui/Facebook'
import Github from 'mdi-material-ui/Github'
import Google from 'mdi-material-ui/Google'
import Twitter from 'mdi-material-ui/Twitter'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from '@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from '@core/hooks/useSettings'

// import { useAuth } from 'src/hooks/useAuth'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

const defaultValues = {
    email: '',
    username: '',
    password: '',
    terms: false
}

// interface FormData {
//     email: string
//     terms: boolean
//     username: string
//     password: string
// }

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
    maxWidth: '46rem',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '35rem'
    }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
    bottom: 0,
    left: '1.875rem',
    position: 'absolute',
    [theme.breakpoints.down('lg')]: {
        left: 0
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

const LinkStyled = styled('a')(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const Register = () => {
    // ** States
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // ** Hook
    const theme = useTheme()

    // ** Vars
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const schema = yup.object().shape({
        password: yup.string().min(5).required(),
        username: yup.string().min(3).required(),
        email: yup.string().email().required(),
        terms: yup.bool().oneOf([true], 'You must accept the privacy policy & terms')
    })

    // ** Hooks
    const {
        settings: { skin }
    } = useSettings()

    // const { register } = useAuth()
    const {
        control,

        // setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = () => {
    // const onSubmit = (data: FormData) => {
        // const { email, username, password } = data
        // register({ email, username, password }, err => {
        //     if (err.email) {
        //         setError('email', {
        //             type: 'manual',
        //             message: err.email
        //         })
        //     }
        //     if (err.username) {
        //         setError('username', {
        //             type: 'manual',
        //             message: err.username
        //         })
        //     }
        // })
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
                    <RegisterIllustrationWrapper>
                        <RegisterIllustration
                            alt='register-illustration'
                            src={`/images/pages/auth-v2-register-illustration-${
                                theme.palette.mode === 'light' ? 'light' : 'dark'
                            }.png`}
                        />
                    </RegisterIllustrationWrapper>
                    <FooterIllustrationsV2 image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />} />
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
                            <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
                            <Typography variant='body2'>Make your app management easy and fun!</Typography>
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
                                            value={value}
                                            onBlur={onBlur}
                                            label='Username'
                                            onChange={onChange}
                                            placeholder='johndoe'
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
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            value={value}
                                            label='Email'
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={Boolean(errors.email)}
                                            placeholder='user@email.com'
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                    Password
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <OutlinedInput
                                            value={value}
                                            label='Password'
                                            onBlur={onBlur}
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
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl sx={{ mt: 1.5, mb: 4 }} error={Boolean(errors.terms)}>
                                <Controller
                                    name='terms'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => {
                                        return (
                                            <FormControlLabel
                                                sx={{
                                                    ...(errors.terms ? { color: 'error.main' } : null),
                                                    '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                                                }}
                                                control={
                                                    <Checkbox
                                                        checked={value}
                                                        onChange={onChange}
                                                        sx={errors.terms ? { color: 'error.main' } : null}
                                                    />
                                                }
                                                label={
                                                    <Fragment>
                                                        <Typography
                                                            variant='body2'
                                                            component='span'
                                                            sx={{ color: errors.terms ? 'error.main' : '' }}
                                                        >
                                                            I agree to{' '}
                                                        </Typography>
                                                        <Link href='/' passHref>
                                                            <LinkStyled
                                                                onClick={(e: MouseEvent<HTMLElement>) =>
                                                                    e.preventDefault()
                                                                }
                                                            >
                                                                privacy policy & terms
                                                            </LinkStyled>
                                                        </Link>
                                                    </Fragment>
                                                }
                                            />
                                        )
                                    }}
                                />
                                {errors.terms && (
                                    <FormHelperText sx={{ mt: 0, color: 'error.main' }}>
                                        {errors.terms.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }}>
                                Sign up
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography variant='body2' sx={{ marginRight: 2 }}>
                                    Already have an account?
                                </Typography>
                                <Typography variant='body2'>
                                    <Link href='/login' passHref>
                                        <LinkStyled>Sign in instead</LinkStyled>
                                    </Link>
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 5 }}>or</Divider>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Link href='/' passHref>
                                    <IconButton
                                        component='a'
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Facebook sx={{ color: '#497ce2' }} />
                                    </IconButton>
                                </Link>
                                <Link href='/' passHref>
                                    <IconButton
                                        component='a'
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Twitter sx={{ color: '#1da1f2' }} />
                                    </IconButton>
                                </Link>
                                <Link href='/' passHref>
                                    <IconButton
                                        component='a'
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Github
                                            sx={{
                                                color: theme =>
                                                    theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]
                                            }}
                                        />
                                    </IconButton>
                                </Link>
                                <Link href='/' passHref>
                                    <IconButton
                                        component='a'
                                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                    >
                                        <Google sx={{ color: '#db4437' }} />
                                    </IconButton>
                                </Link>
                            </Box>
                        </form>
                    </BoxWrapper>
                </Box>
            </RightWrapper>
        </Box>
    )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
