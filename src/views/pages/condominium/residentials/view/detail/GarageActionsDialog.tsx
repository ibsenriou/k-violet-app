import { forwardRef, ReactElement, Ref, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Close from 'mdi-material-ui/Close'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAppDispatch } from 'src/store'
import { addGarage, deleteGarage, updateGarage } from 'src/store/apps/condominium/residentialDetail'

import { GarageType } from '@typesApiMapping/apps/condominium/garageTypes'
import useLoading from 'src/hooks/useLoading'
import { useQueryClient } from '@tanstack/react-query'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface GarageActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: GarageType | undefined
    open: boolean
    toggle: () => void
    residentialId: string
}

const schema = yup.object().shape({
    name: yup.string().max(6, 'Este campo não pode conter mais de 6 caracteres.').required('Este campo é obrigatório!'),
    number_of_spots: yup
        .number()
        .typeError('Este campo é obrigatório!')
        .min(1, 'Este campo não pode ser menor que 1.')
        .required('Este campo é obrigatório!')
        .max(999, 'Este campo não pode ser maior que 999.'),
    is_garage_being_used: yup.boolean().default(true),
    is_garage_available_for_rent: yup.boolean().default(false),
    is_drawer_type_garage: yup.boolean().default(false),
    is_covered_type_garage: yup.boolean().default(false)
})

const defaultValues = {
    name: '',
    number_of_spots: 1,
    is_garage_being_used: false,
    is_garage_available_for_rent: false,
    is_drawer_type_garage: false,
    is_covered_type_garage: false
}

const GarageActionsDialog = ({ actionType, actionData, open, toggle, residentialId }: GarageActionsDialogInterface) => {
    const dispatch = useAppDispatch()
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const queryClient = useQueryClient()

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Garagem',
            content: 'Insira uma garagem nesta Unidade Residencial neste condomínio.'
        },
        edit: {
            title: 'Editar Garagem',
            content: 'Edite as informações de uma garagem dessa Unidade Residencial.'
        },
        delete: {
            title: 'Remover Garagem',
            content: 'Remova a garagem da Unidade Residencial.'
        },
        view: {
            title: 'Visualizar Garagem',
            content: 'Visualize as informações de uma garagem dessa Unidade Residencial.'
        },
        default: {
            title: 'Error - Unknown Action Type',
            content: 'Error - Unknown Action Type'
        }
    }

    const _onSubmit = async (data: GarageType): Promise<void> => {
        const commonPayload = {
            name: data.name,
            description: data.description,
            number_of_spots: data.number_of_spots,
            is_garage_being_used: data.is_garage_being_used,
            is_garage_available_for_rent: data.is_garage_available_for_rent,
            is_drawer_type_garage: data.is_drawer_type_garage,
            is_covered_type_garage: data.is_covered_type_garage
        }

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
            add: () => wrapDispatch(addGarage({ ...commonPayload, id: '0' })),
            edit: () => wrapDispatch(updateGarage({ ...commonPayload, id: data.id })),
            delete: () => wrapDispatch(deleteGarage({ id: data.id })),
            view: () => {} // do nothing,
        }

        if (!actionType) {
            console.error('Unknown action type')

            return
        }

        queryClient.invalidateQueries({
          queryKey: ['residential.garages', residentialId]
        })

        const dispatchAction = actionDispatchMap[actionType]

        if (!dispatchAction) {
            console.error('Unknown action type')

            return
        }

        const actionResult = await dispatchAction()
        if (actionResult && actionResult.error) {
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
                            {`Esta ação irá excluir permanentemente a garagem. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={6} xs={12}>
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
                                        placeholder='42'
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
                            <Controller
                                name='number_of_spots'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        type='number'
                                        label='Quantidade de Vagas'
                                        onChange={onChange}
                                        placeholder='1'
                                        error={Boolean(errors.number_of_spots)}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    />
                                )}
                            />
                            {errors.number_of_spots && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.number_of_spots.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <CardHeader
                            title='Informações Adicionais'
                            titleTypographyProps={{ variant: 'body1', align: 'center' }}
                        />
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Tooltip title='Garagem está em utilização?' placement='bottom-start'>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Box sx={{ marginLeft: 3 }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                    Utilização
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <Controller
                                                name='is_garage_being_used'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch
                                                        checked={value}
                                                        onChange={onChange}
                                                        disabled={actionType === 'view' || actionType === 'delete'}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Box>
                                </Tooltip>

                                <Tooltip title='Garagem disponível para locação?' placement='bottom-start'>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Box sx={{ marginLeft: 3 }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                    Locação
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <Controller
                                                name='is_garage_available_for_rent'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch
                                                        checked={value}
                                                        onChange={onChange}
                                                        disabled={actionType === 'view' || actionType === 'delete'}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Box>
                                </Tooltip>

                                <Tooltip title='Garagem do tipo gaveta?' placement='bottom-start'>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Box sx={{ marginLeft: 3 }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                    Gaveta
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <Controller
                                                name='is_drawer_type_garage'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch
                                                        checked={value}
                                                        onChange={onChange}
                                                        disabled={actionType === 'view' || actionType === 'delete'}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Box>
                                </Tooltip>

                                <Tooltip title='Garagem coberta?' placement='bottom-start'>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Box sx={{ marginLeft: 3 }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                    Coberta
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <FormControl>
                                            <Controller
                                                name='is_covered_type_garage'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch
                                                        checked={value}
                                                        onChange={onChange}
                                                        disabled={actionType === 'view' || actionType === 'delete'}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Box>
                                </Tooltip>
                            </Box>
                        </CardContent>
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

export default GarageActionsDialog
