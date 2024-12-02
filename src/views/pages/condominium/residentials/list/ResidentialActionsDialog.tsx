import { forwardRef, ReactElement, Ref, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Close from 'mdi-material-ui/Close'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { RootState, useAppDispatch } from 'src/store'

import { addResidential, deleteResidential, updateResidential } from 'src/store/apps/condominium/residentials'

import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface ResidentialActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | null
    actionData: ResidentialType | {}
    open: boolean
    toggle: () => void
}

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    fk_uhab: yup.string().required('Este campo é obrigatório!'),
    fk_lookup_type_of_residential: yup.string().required('Este campo é obrigatório!')
})

const defaultValues = {
    id: '0',
    name: '',
    fk_uhab: '',
    fk_lookup_type_of_residential: ''
}

const ResidentialActionsDialog = ({ actionType, actionData, open, toggle }: ResidentialActionsDialogInterface) => {
    const residentialsStore = useSelector((state: RootState) => state.residentials)

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

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Residencial',
            content: 'Insira uma Unidade Residencial neste Condomínio.'
        },
        edit: {
            title: 'Editar Residencial',
            content: 'Edite as informações da Unidade Residencial.'
        },
        delete: {
            title: 'Remover Residencial',
            content: 'Remova a Unidade Residencial.'
        },
        default: {
            title: 'Error - Unknown Action Type',
            content: 'Error - Unknown Action Type'
        }
    }

    const _onSubmit = async (data: ResidentialType): Promise<void> => {
        const commonPayload = {
            id: data.id,
            description: '',
            name: data.name,
            fk_uhab: data.fk_uhab,
            fk_lookup_type_of_residential: data.fk_lookup_type_of_residential
        }

        /**
         * Wraps the Redux dispatch action in a standard Promise object.
         * @param action The Redux action to dispatch.
         * @returns A promise resolving to an object containing an optional error string.
         */
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
            add: () => wrapDispatch(addResidential({ ...commonPayload, id: '0' })),
            edit: () => wrapDispatch(updateResidential(commonPayload)),
            delete: () => wrapDispatch(deleteResidential({ id: data.id }))
        }

        if (actionType === null) {
            console.error('Unknown action type')

            return
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
                            {`Esta ação irá excluir este residencial do Condomínio e poderá influenciar em documentações em diversos módulos do sistema!\n
                            Caso tenha certeza, clique em "Excluir".`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={12} xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <FormControl fullWidth>
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        value={value}
                                        label='Nome'
                                        onChange={onChange}
                                        placeholder='Ex: 101, 102, 201, etc...'
                                        error={Boolean(errors.name)}
                                        disabled={actionType === 'delete'}
                                    />
                                )}
                            />
                            {errors.name && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel id='fk_lookup_type_of_residential'>Tipo de Residencial</InputLabel>
                            <Controller
                                name='fk_lookup_type_of_residential'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        fullWidth
                                        value={value}
                                        id='fk_lookup_type_of_residential'
                                        label='Tipo de Residencial'
                                        labelId='select-the-residential-type'
                                        onChange={e => onChange(e.target.value)}
                                        disabled={actionType === 'delete'}
                                    >
                                        {residentialsStore.fk_lookup_type_of_residential.map(({ id, description }) => (
                                            <MenuItem key={id} value={id}>
                                                {description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_lookup_type_of_residential && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.fk_lookup_type_of_residential.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel id='fk_uhab'>Agrupamento</InputLabel>
                            <Controller
                                name='fk_uhab'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        fullWidth
                                        value={value}
                                        id='fk_uhab'
                                        label='Agrupamento'
                                        labelId='select-the-condominium-grouping'
                                        onChange={e => onChange(e.target.value)}
                                        disabled={actionType === 'delete'}
                                    >
                                        {residentialsStore.condominiumGroupings.map(({ id, name }) => (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_uhab && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.fk_uhab.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
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
            </DialogActions>
        </Dialog>
    )
}

export default ResidentialActionsDialog
