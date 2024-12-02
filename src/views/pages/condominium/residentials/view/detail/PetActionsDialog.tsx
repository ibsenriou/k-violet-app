import { ChangeEvent, ElementType, forwardRef, ReactElement, Ref, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Close from 'mdi-material-ui/Close'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import useService from 'src/hooks/useService'

import { useAppDispatch } from 'src/store'
import { addPet, deletePet, updatePet } from 'src/store/apps/condominium/residentialDetail'

import { PetType } from '@typesApiMapping/apps/pets/petTypes'

import { CoreService } from 'src/services/coreService'
import { PetsService } from 'src/services/petsService'

import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius,
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

interface PetActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: PetType | undefined
    open: boolean
    toggle: () => void,
    residentialId: string
}

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    fk_animal_species: yup.string().required('Este campo é obrigatório!'),
    fk_animal_breed: yup.string().required('Este campo é obrigatório!')
})

const defaultValues: Partial<PetType> & { fk_animal_species: string } = {
    name: '',
    fk_animal_species: '',
    fk_animal_breed: '',
    fk_animal_size: '',
    fk_animal_color: '',
    fk_residential: '',
    image: ''
}

const PetActionsDialog = ({ actionType, actionData, open, toggle, residentialId }: PetActionsDialogInterface) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const queryClient = useQueryClient()

    const dispatch = useAppDispatch()

    const [imgSrc, setImgSrc] = useState<string>('/images/avatars/pet-avatar.jpg')
    const [imageUpload, setImageUpload] = useState<File | string>('')

    const { data: animalColorList } = useService(CoreService.color)
    const { data: animalSizeList } = useService(PetsService.animal_size)

    const animalSpeciesQuery = useQuery({
        queryKey: ['animal_species'],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => PetsService.animal_species.get(),
        select: response => response.data.results
    })
    const animalSpeciesList = animalSpeciesQuery.data

    const animalBreedQuery = useQuery({
        queryKey: ['animal_breed', watch('fk_animal_species')],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => PetsService.animal_breed_by_speciesId.get({ animalSpeciesId: watch('fk_animal_species') }),
        select: response => response.data.results,
        enabled: animalSpeciesQuery.isSuccess
    })

    const animalBreedList = animalBreedQuery.data
    const breed = animalBreedList?.find(breed => breed.id === watch('fk_animal_breed'))

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Pet',
            content: 'Insira um pet nesta Unidade Residencial.'
        },
        edit: {
            title: 'Editar Pet',
            content: 'Edite as informações de um pet dessa Unidade Residencial.'
        },
        delete: {
            title: 'Remover Pet',
            content: 'Remova o pet da Unidade Residencial.'
        },
        view: {
            title: 'Visualizar Pet',
            content: 'Visualize as informações de um pet dessa Unidade Residencial.'
        },
        default: {
            title: 'Error - Unknown Action Type',
            content: 'Error - Unknown Action Type'
        }
    }

    const handleResetImage = () => {
        setImgSrc('/images/avatars/pet-avatar.jpg')
        setImageUpload('')
    }

    const onChangeFile = (file: ChangeEvent) => {
        const reader = new FileReader()
        const { files } = file.target as HTMLInputElement

        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result as string)
            reader.readAsDataURL(files[0])

            setImageUpload(files[0])
        }
    }

    const _onSubmit = async (data: PetType) => {
        const wrapDispatch = async (action: any): Promise<{ error?: string }> => {
            return new Promise(resolve => {
                dispatch(action).then((resolvedAction: any) => {
                    if ('error' in resolvedAction) {
                        resolve({ error: resolvedAction.error.message })
                    } else {
                        resolve({})
                    }
                })
            })
        }

        const actionDispatchMap = {
            add: () => wrapDispatch(addPet({ ...data, image: imageUpload, id: '0' })),
            edit: () => wrapDispatch(updatePet({ ...data, image: imageUpload })),
            delete: () => wrapDispatch(deletePet({ id: data.id })),
            view: () => Promise.resolve // do nothing,
        }

        if (actionType === null) {
            console.error('Unknown action type')

            return
        }

        const dispatchAction = actionDispatchMap[actionType]

        if (!dispatchAction) {
            console.error('Unknown action type')

            return
        }

        const actionResult = await dispatchAction()

        queryClient.invalidateQueries({
          queryKey: ['residential.pets', residentialId]
      })
        if (actionResult && 'error' in actionResult && actionResult.error) {
            toast.error(
                'Ocorreu um erro ao realizar a ação. Por favor, tente novamente. Caso problema persista, favor entrar em contato com a nossa equipe de suporte.',
                {
                    position: 'bottom-left',
                    duration: 10000
                }
            )
        } else {
            toast.success('Ação realizada com sucesso!', {
                position: 'bottom-left'
            })
        }

        handleClose()
    }

    const [onSubmit, submitLoading] = useLoading(_onSubmit)

    const handleClose = () => {
        toggle()
        reset()
    }

    useEffect(() => {
        if (actionType !== 'add') {
            reset({
                ...defaultValues,
                ...actionData
            })
        } else {
            reset(defaultValues)
        }
    }, [actionType, actionData, reset])

    useEffect(() => {
        if (actionType !== 'add') {
            if (breed?.fk_animal_species) {
                setValue('fk_animal_species', breed?.fk_animal_species)
            }
        }
    }, [actionType, breed, actionData, open, setValue])

    if (!actionType) return null

    const dialogTitle = actionTypeConfig[actionType]?.title || actionTypeConfig['default'].title
    const dialogContent = actionTypeConfig[actionType]?.content || actionTypeConfig['default'].content

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='md'
            scroll='body'
            onClose={() => toggle()}
            TransitionComponent={Transition}
            onBackdropClick={() => toggle()}
        >
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => handleClose()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>

                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        {dialogTitle}
                    </Typography>
                    <Typography variant='body2'>{dialogContent}</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    {actionType === 'delete' && (
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá excluir permanentemente o pet. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'success'}
                                sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
                            >
                                {getInitials(watch('name') || '')}
                            </CustomAvatar>
                            {/* <ImgStyled src={imgSrc} alt='Profile Pic' />
                            <Box>
                                {actionType === 'view' || actionType === 'delete' ? (
                                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                                        Permitido PNG ou JPEG. Tamanho máximo de 800K.
                                    </Typography>
                                ) : (
                                    <div>
                                        <ButtonStyled
                                            component='label'
                                            variant='contained'
                                            htmlFor='account-settings-upload-image'
                                        >
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
                                    </div>
                                )}
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
                                        value={value}
                                        label='Nome'
                                        onChange={onChange}
                                        placeholder='Totó'
                                        error={Boolean(errors.name)}
                                        disabled={actionType === 'view' || actionType === 'delete'}
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
                            <InputLabel id='especie-select'>Selecione a Espécie</InputLabel>
                            <Controller
                                name='fk_animal_species'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required
                                        fullWidth
                                        value={value}
                                        id='especie-select'
                                        label='Selecione a Espécie'
                                        labelId='especie-select'
                                        onChange={e => {
                                            onChange(e)
                                            setValue('fk_animal_breed', '')
                                        }}
                                        inputProps={{ placeholder: 'Selecione a Espécie' }}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {animalSpeciesList &&
                                            animalSpeciesList.map(specie => (
                                                <MenuItem key={specie.id} value={specie.id}>
                                                    {specie.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                        {errors.fk_animal_species && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.fk_animal_species.message}
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id='raca-select'>Selecione a Raça</InputLabel>
                            <Tooltip title='Opcional' placement='top-start'>
                                <Controller
                                    name='fk_animal_breed'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            required={false}
                                            fullWidth
                                            value={value}
                                            id='raca-select'
                                            label='Selecione a Raça'
                                            labelId='raca-select'
                                            onChange={onChange}
                                            inputProps={{ placeholder: 'Selecione a Raça' }}
                                            disabled={
                                                actionType === 'view' ||
                                                actionType === 'delete' ||
                                                watch('fk_animal_species') == ''
                                            }
                                        >
                                            {animalBreedList &&
                                                animalBreedList.map(breed => (
                                                    <MenuItem key={breed.id} value={breed.id}>
                                                        {breed.description}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                />
                            </Tooltip>
                        </FormControl>
                        {errors.fk_animal_breed && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.fk_animal_breed.message}
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='porte-select'>Selecione o Porte</InputLabel>
                            <Tooltip title='Opcional' placement='top-start'>
                                <Controller
                                    name='fk_animal_size'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            required={false}
                                            fullWidth
                                            value={value}
                                            id='porte-select'
                                            label='Selecione o Porte'
                                            labelId='porte-select'
                                            onChange={onChange}
                                            inputProps={{ placeholder: 'Selecione o Porte' }}
                                            disabled={actionType === 'view' || actionType === 'delete'}
                                        >
                                            {animalSizeList &&
                                                animalSizeList.map(size => (
                                                    <MenuItem key={size.id} value={size.id}>
                                                        {size.description}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                />
                            </Tooltip>
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='cor-select'>Selecione a Cor</InputLabel>
                            <Tooltip title='Opcional' placement='top-start'>
                                <Controller
                                    name='fk_animal_color'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            required={false}
                                            fullWidth
                                            value={value}
                                            id='cor-select'
                                            label='Selecione a Cor'
                                            labelId='cor-select'
                                            onChange={onChange}
                                            inputProps={{ placeholder: 'Selecione a Cor' }}
                                            disabled={actionType === 'view' || actionType === 'delete'}
                                        >
                                            {animalColorList &&
                                                animalColorList.map(color => (
                                                    <MenuItem key={color.id} value={color.id}>
                                                        {color.description}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                {actionType === 'view' ? (
                    <Button variant='outlined' color='secondary' onClick={handleClose}>
                        Cancelar
                    </Button>
                ) : (
                    <div>
                        <Button
                            variant='contained'
                            type='submit'
                            color={actionType === 'delete' ? 'error' : 'primary'}
                            onClick={handleSubmit(onSubmit)}
                            sx={{ marginRight: 1 }}
                            disabled={submitLoading}
                        >
                            {actionType === 'add' && 'Salvar'}
                            {actionType === 'edit' && 'Atualizar'}
                            {actionType === 'delete' && 'Excluir'}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancelar
                        </Button>
                    </div>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default PetActionsDialog
