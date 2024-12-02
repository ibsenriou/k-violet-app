import { ChangeEvent, ElementType, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import CustomAvatar from '@core/components/mui/avatar'

import { useAppDispatch, useAppSelector } from 'src/store'
import { selectUserNatualPerson, updateNaturalPerson } from 'src/store/apps/user'

import { NaturalPersonType } from '@typesApiMapping/apps/people/naturalPersonTypes'

import ConfirmationDialog from '@core/components/confirmation-dialog'
import { getInitials } from '@core/utils/get-initials'

const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderadius: theme.shape.borderRadius,
    objectFit: 'cover'
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
        textAlign: 'center',
        marginTop: theme.spacing(4)
    }
}))

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    date_of_birth: yup.string().required('Este campo é obrigatório!').typeError('Por favor, informe uma data válida!')
})

const UserInformationsTab = () => {
    const userNatualPerson = useAppSelector(selectUserNatualPerson)
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: userNatualPerson,
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema)
    })
    const dispatch = useAppDispatch()

    const [formDisabled, setFormDisabled] = useState(true)

    const [focus, setFocused] = useState(false)
    const [imgSrc, setImgSrc] = useState<string>(userNatualPerson.image || '/images/avatars/1.png')

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    const toggleFormDisabled = () => {
        setFormDisabled(!formDisabled)
    }

    const handleCancel = () => {
        reset({
            ...userNatualPerson
        })
        toggleFormDisabled()
    }

    const onSubmit = (data: NaturalPersonType) => {
        if (imgSrc == '/images/avatars/1.png') {
            data.image = null
        } else {
            data.image = imgSrc
        }

        return dispatch(updateNaturalPerson(data)).then(() => {
            toggleFormDisabled()
        })
    }

    // const onChangeFile = (file: ChangeEvent) => {
    //     const reader = new FileReader()
    //     const { files } = file.target as HTMLInputElement

    //     if (files && files.length !== 0) {
    //         reader.onload = () => setImgSrc(reader.result as string)
    //         reader.readAsDataURL(files[0])
    //     }
    // }

    // const handleResetImage = () => {
    //     setImgSrc('/images/avatars/1.png')
    // }

    return (
        <CardContent>
            <Grid container spacing={7}>
                <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CustomAvatar
                            skin='light'
                            variant='rounded'
                            color={'success'}
                            sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
                        >
                            {getInitials(watch('name'))}
                        </CustomAvatar>
                        {/* <ImgStyled src={imgSrc} alt='Profile Pic' /> */}
                        {/* <Box>
                            <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                                Adicionar Foto
                                <input
                                    hidden
                                    type='file'
                                    onChange={onChangeFile}
                                    accept='image/png, image/jpeg'
                                    id='account-settings-upload-image'
                                />
                            </ButtonStyled>
                            <ResetButtonStyled color='error' variant='outlined' onClick={handleResetImage}>
                                Remover Foto
                            </ResetButtonStyled>
                            <Typography variant='body2' sx={{ marginTop: 5 }}>
                                Permitido PNG ou JPEG. Tamanho máximo de 800K.
                            </Typography>
                            <Typography variant='body2' sx={{ marginLeft: '-1rem' }}>
                                <Controller
                                    name='has_natural_person_given_permission_to_use_his_image'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Tooltip title='Autorização do uso de imagem para demais moradores'>
                                            <FormControlLabel
                                                label='Autorizar uso de imagem'
                                                labelPlacement='start'
                                                control={<Switch checked={value} onChange={onChange} />}
                                            />
                                        </Tooltip>
                                    )}
                                />
                            </Typography>
                        </Box> */}
                    </Box>
                </Grid>

                <Grid item sm={12} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    disabled={formDisabled}
                                    value={value}
                                    label='Nome Completo'
                                    onChange={onChange}
                                    placeholder='Nome Completo'
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='national_individual_taxpayer_identification'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <InputMask
                                    mask={'999.999.999-99'}
                                    maskChar=''
                                    value={value}
                                    onChange={onChange}
                                    disabled={true}
                                >
                                    {() => <TextField label='CPF' disabled={true} />}
                                </InputMask>
                            )}
                        />
                    </FormControl>
                </Grid>

                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='date_of_birth'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    disabled={formDisabled}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    value={value}
                                    type={value || focus ? 'date' : 'text'}
                                    label='Data de Nascimento'
                                    onChange={onChange}
                                />
                            )}
                        />
                    </FormControl>
                    {errors.date_of_birth && <FormHelperText error>{errors.date_of_birth.message}</FormHelperText>}
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
                                title='Atualizar Informações'
                                subTitle='Atualizar Informações do Usuário'
                                content='Esta ação irá alterar as informações de seu usuário e poderá influenciar em documentações em diversos módulos do sistema!'
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

export default UserInformationsTab
