// ** React Imports
import { forwardRef, ReactElement, Ref, useEffect } from 'react'

// ** Actions Imports
import { addCommonArea, deleteCommonArea, updateCommonArea } from 'src/store/apps/condominium/condominium-common-areas'

// ** MUI Imports
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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icons Imports
import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'
import Close from 'mdi-material-ui/Close'
import toast from 'react-hot-toast'
import { useAppDispatch } from 'src/store'
import { watch } from 'fs'
import useLoading from 'src/hooks/useLoading'

// ** Custom Styles
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface CommonAreaActionsDialogProps {
    actionType: 'add' | 'edit' | 'delete'
    actionData: CondominiumCommonAreaType | undefined
    open: boolean
    toggle: () => void
}

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    description: yup.string().required('Este campo é obrigatório!'),
    capacity_of_people: yup
        .number()
        .typeError('Este campo é obrigatório!')
        .required('Este campo é obrigatório!')
        .min(1, 'Valor mínimo é 1')
        .max(9999, 'Valor máximo é 9999'),
    does_it_requires_reservation: yup.boolean().required('Este campo é obrigatório!'),
    does_it_allows_guests: yup.boolean().required('Este campo é obrigatório!'),
    does_it_have_usage_fee: yup.boolean().required('Este campo é obrigatório!'),
    does_it_allows_reservation_to_defaulters: yup.boolean().required('Este campo é obrigatório!'),
    does_it_have_entry_checklist: yup.boolean().required('Este campo é obrigatório!'),
    does_it_have_exit_checklist: yup.boolean().required('Este campo é obrigatório!'),

    working_week_days: yup
        .string()
        .required('Este campo é obrigatório!')
        .matches(
            /^[0-1]{7}$/,
            'Something went wrong! Working Week Days must be a 7 Digits Binary String (1 = Working Day, 0 = Not Working Day)'
        ),

    fk_condominium_common_area_utilization_fee_history: yup.number().nullable()
})

const defaultValues = {
    name: '',
    description: '',
    capacity_of_people: 1,
    does_it_requires_reservation: false,
    does_it_allows_guests: false,
    does_it_have_usage_fee: false,
    does_it_allows_reservation_to_defaulters: false,
    does_it_have_entry_checklist: false,
    does_it_have_exit_checklist: false,
    working_week_days: '1111111' // Working days from Sunday to Monday is a Binary 7 Digits String (1 = Working Day, 0 = Not Working Day)
}

const CommonAreaActionsDialog = ({ open, toggle, actionType, actionData }: CommonAreaActionsDialogProps) => {
    // ** Hooks
    const dispatch = useAppDispatch()

    // ** React Hook Form
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

    // ** Reset form with actionData when actionType or actionData changes
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

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Área Comum',
            content: 'Insira uma Área Comum neste condomínio.'
        },
        edit: {
            title: 'Editar Área Comum',
            content: 'Edite as informações da Área Comum.'
        },
        delete: {
            title: 'Remover Área Comum',
            content: 'Remova a Área Comum.'
        },
        default: {
            title: 'Error - Unknown Action Type',
            content: 'Error - Unknown Action Type'
        }
    }

    /**
     * Asynchronously handles form submission for residential actions.
     * Operates on the dispatching of Redux actions.
     */
    const _onSubmit = async (data: CondominiumCommonAreaType): Promise<void> => {
        const commonPayload = {
            id: data.id,
            name: data.name,
            description: data.description,
            capacity_of_people: data.capacity_of_people,
            does_it_requires_reservation: data.does_it_requires_reservation,
            does_it_allows_guests: data.does_it_allows_guests,
            does_it_have_usage_fee: data.does_it_have_usage_fee,
            does_it_allows_reservation_to_defaulters: data.does_it_allows_reservation_to_defaulters,
            does_it_have_entry_checklist: data.does_it_have_entry_checklist,
            does_it_have_exit_checklist: data.does_it_have_exit_checklist,
            working_week_days: data.working_week_days,
            fk_condominium_common_area_utilization_fee_history: data.fk_condominium_common_area_utilization_fee_history
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

        // An object mapping residential action types to corresponding Redux dispatch functions.
        const actionDispatchMap = {
            add: () => wrapDispatch(addCommonArea({ ...commonPayload, id: '0' })),
            edit: () => wrapDispatch(updateCommonArea(commonPayload)),
            delete: () => wrapDispatch(deleteCommonArea({ id: data.id }))
        }

        // Executes the mapped Redux action based on the `actionType`.
        const dispatchAction = actionDispatchMap[actionType]

        if (!dispatchAction) {
            console.error('Unknown action type')

            return
        }

        // Execute the dispatch action and handle the resulting promise.
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

        // Close the dialog after dispatch.
        handleClose()
    }

    const [onSubmit, submitLoading] = useLoading(_onSubmit)

    const handleClose = () => {
        toggle()
        reset()
    }

    // ** Dialog Title and Content Rendered based on actionType
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
                    {actionType === 'delete' && !actionData?.have_any_reservation_for_future && (
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá excluir permanentemente a Área Comum. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}

                    {actionType === 'delete' && actionData?.have_any_reservation_for_future && (
                        <Alert severity='error'>
                            <AlertTitle>Ação não permitida!</AlertTitle>
                            {`Esta ação não pode ser realizada pois existem reservas programadas para esta Área Comum. Por favor, verifique as reservas e tente novamente!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={8} xs={12} sx={{ marginTop: 4.8 }}>
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
                                        placeholder='Salão de Festas...'
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

                    <Grid item sm={4} xs={12} sx={{ marginTop: 4.8 }}>
                        <FormControl fullWidth>
                            <Controller
                                name='capacity_of_people'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        type='number'
                                        InputLabelProps={{ shrink: true }}
                                        value={value}
                                        label='Capacidade de Pessoas'
                                        onChange={onChange}
                                        placeholder='42'
                                        error={Boolean(errors.capacity_of_people)}
                                        disabled={actionType === 'delete'}
                                    />
                                )}
                            />
                            {errors.capacity_of_people && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.capacity_of_people.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='description'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        rows={4}
                                        multiline
                                        value={value}
                                        label='Descrição'
                                        onChange={onChange}
                                        placeholder='Descrição da Área Comum Salão de Festas...'
                                        error={Boolean(errors.description)}
                                        disabled={actionType === 'delete'}
                                    />
                                )}
                            />
                            {errors.description && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.description.message}
                                </FormHelperText>
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
                    disabled={
                        actionType === 'delete' ? actionData?.have_any_reservation_for_future : false || submitLoading
                    }
                    onClick={handleSubmit(onSubmit)}
                    sx={{ marginRight: 1 }}
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

export default CommonAreaActionsDialog
