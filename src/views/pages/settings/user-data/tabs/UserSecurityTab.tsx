import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'



import { useAppDispatch } from 'src/store'
import { changePassword } from 'src/store/apps/user'


import ConfirmationDialog from '@core/components/confirmation-dialog'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'


const schema = yup.object().shape({
  current_password: yup.string().required('Este campo é obrigatório!'),
  new_password: yup.string().required('Este campo é obrigatório!').min(8, 'A senha deve conter no mínimo 8 caracteres!').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'A senha deve conter letras e números!'),
  confirm_password: yup.string().required('Este campo é obrigatório!').oneOf([yup.ref('new_password'), null], 'As senhas devem ser iguais!')
})

const UserSecurityTab = () => {
  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  })
  const dispatch = useAppDispatch()

  const router = useRouter()

  const [formDisabled, setFormDisabled] = useState(true)



  const toggleFormDisabled = () => {
    setShowCurrentPassword(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setFormDisabled(!formDisabled)
  }

  const handleCancel = () => {
    reset({
      current_password: '',
      new_password: '',
      confirm_password: ''
    })
    toggleFormDisabled()
  }

  const { logout } = useAuth()

  const onSubmit = (data: {
    current_password: string
    new_password: string
    confirm_password: string
  }) => {
    return dispatch(changePassword(data)).then((data) => {
      if (data.type === "appUsers/changePassword/rejected") {
        handleCancel()
      } else {
        toast.success('Senha alterada com sucesso!', {
          position: 'bottom-left',
          duration: 3000
        })
        setTimeout(() => {
          logout()
        }, 3000)

      }
    })
  }




  // Watch new_password filed in form to change colors in FormErrors to red if check fails and green if it passes
  const watchNewPassword = watch('new_password', '')


  // if new password has less than 8 characters, show error
  const newPasswordHasLengthError = watchNewPassword.length < 8

  // if new password don't have letters and numbers, show error
  const newPasswordHasLettersAndDigitsError = !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(watchNewPassword)


  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <CardContent>
      <Grid container spacing={7}>

        <Grid item xs={12}>
          <Typography variant='h6'>Alterar Senha</Typography>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Typography variant='body2' color='textSecondary'>
            A senha deve conter no mínimo 8 caracteres, sendo composta por letras e números.
          </Typography>
        </Grid>

        <Grid item sm={7} xs={12}>
          <FormControl>
            <Controller
              name='current_password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled={formDisabled}
                  value={value}
                  label='Senha Atual'
                  onChange={onChange}
                  type={showCurrentPassword ? 'text' : 'password'}
                  error={Boolean(errors.confirm_password)}
                  InputProps={formDisabled ? {} : {
                    endAdornment: (

                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            {errors.confirm_password && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.confirm_password.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item sm={7} xs={12}>
          <FormControl>
            <Controller
              name='new_password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled={formDisabled}
                  value={value}
                  label='Nova Senha'
                  onChange={onChange}
                  type={showPassword ? 'text' : 'password'}
                  error={Boolean(errors.new_password)}
                  InputProps={formDisabled ? {} : {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            {!formDisabled && (<>
              <FormHelperText sx={{ color: newPasswordHasLengthError ? 'error.main' : 'success.main' }}>A senha deve conter no mínimo 8 caracteres.</FormHelperText>
              <FormHelperText sx={{ color: newPasswordHasLettersAndDigitsError ? 'error.main' : 'success.main'}}>A senha deve conter letras e números.</FormHelperText>
            </>
            )}
          </FormControl>
        </Grid>

        <Grid item sm={7} xs={12}>
          <FormControl>
            <Controller
              name='confirm_password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled={formDisabled}
                  value={value}
                  label='Confirmar Senha'
                  onChange={onChange}
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={Boolean(errors.confirm_password)}
                  InputProps={formDisabled ? {} : {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            {errors.confirm_password && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.confirm_password.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>



        <Grid item xs={12}>
          {formDisabled && (
            <Button
              variant='contained'
              color='primary'
              sx={{ marginRight: 3.5 }}
              type='submit'
              onClick={() => toggleFormDisabled()}
            >
              Habilitar Edição
            </Button>
          )}
          {!formDisabled && (
            <>
              <ConfirmationDialog
                title='Alterar Senha'
                subTitle='Deseja realmente alterar sua senha de acesso ao sistema?'
                content='Após a confirmação, sua senha será alterada e você será desconectado do sistema.'
                onConfirm={onSubmit}
                render={confirm => (
                  <Button
                    variant='contained'
                    sx={{ marginRight: 3.5 }}
                    type='submit'
                    onClick={handleSubmit(confirm)}
                  >
                    Salvar Alterações
                  </Button>
                )}
              />

              <Button
                variant='contained'
                color='error'
                type='submit'
                onClick={() => {
                  handleCancel()
                }}
              >
                Cancelar
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default UserSecurityTab


