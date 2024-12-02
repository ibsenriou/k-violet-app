// ** React Imports
import { forwardRef, ReactElement, Ref, useEffect, useMemo, useState } from 'react'

// ** Redux Store

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Actions Imports
import {
    addCondominiumCommonAreaItem,
    deleteCondominiumCommonAreaItem,
    updateCondominiumCommonAreaItem
} from 'src/store/apps/condominium/condominium-common-area-detail'

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
import Close from 'mdi-material-ui/Close'

// ** React Hot Toast
import toast from 'react-hot-toast'

// ** Types Imports
import { CondominiumCommonAreaItemType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaItemTypes'
import { RootState, useAppDispatch } from 'src/store'
import useLoading from 'src/hooks/useLoading'

// ** Custom Styles
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface CondominiumCommonAreaItemActionsDialogInterface {
    actionType: 'add' | 'view' | 'edit' | 'delete'
    actionData: CondominiumCommonAreaItemType
    open: boolean
    toggle: () => void
}

const schema = yup.object().shape({
    fk_condominium_common_area: yup.string().required('Este campo é obrigatório!'),
    description: yup.string().required('Este campo é obrigatório!'),
    quantity_of_items: yup
        .number()
        .typeError('Este campo é obrigatório!')
        .required('Este campo é obrigatório!')
        .positive('Este campo deve ser positivo!')
        .min(1, 'Este campo deve ser maior que 0!'),
    unitary_value: yup
        .string()
        .required('Este campo é obrigatório!')
        .matches(/^[0-9]+(\.[0-9]{1,2})?$/, 'Este campo deve conter um valor monetário válido!')
        .max(10, 'Este campo deve conter no máximo 10 caracteres!')
        .test('unitary_value', 'Este campo deve conter apenas 7 dígitos antes do ponto!', value => {
            if (value) {
                const [integer, decimal] = value.split('.')

                return integer.length <= 7
            }

            return false
        }),

    item_model: yup.string(),
    item_brand: yup.string(),
    observations: yup.string(),
    date_of_acquisition: yup
        .string()
        .nullable()
        .test('data_de_aquisicao', 'Data inválida!', value => {
            if (value === '') {
                return true
            }
            if (value) {
                const date = new Date(value)

                return date instanceof Date && !isNaN(date.getTime())
            }

            return false
        })
})

const CondominiumCommonAreaItemActionsDialog = ({
    actionType,
    actionData,
    open,
    toggle
}: CondominiumCommonAreaItemActionsDialogInterface) => {
    // ** States
    const [focus, setFocused] = useState(false)

    // Prevents the date input from showing amidst the placeholder text.
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    // ** Redux Store
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    const defaultValues = useMemo(
        () => ({
            description: '',
            quantity_of_items: 1,
            unitary_value: '',
            fk_condominium_common_area: store.commonArea.id,

            item_model: '',
            item_brand: '',
            date_of_acquisition: '',
            observations: ''
        }),
        [store.commonArea.id]
    )

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

    const inViewMode = actionType === 'view'
    const inDeleteMode = actionType === 'delete'

    const formDisabled = inViewMode || inDeleteMode

    useEffect(() => {
        if (actionType !== 'add') {
            reset({
                ...defaultValues,
                ...actionData,
                date_of_acquisition: actionData.date_of_acquisition || ''
            })
        } else {
            reset(defaultValues)
        }
    }, [actionType, actionData, reset, defaultValues])

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Item de Área Comum',
            content: 'Insira um Item nesta Área Comum.'
        },
        view: {
            title: 'Visualizar Item de Área Comum',
            content: 'Visualize as informações de um Item desta Área Comum.'
        },
        edit: {
            title: 'Editar Item de Área Comum',
            content: 'Edite as informações de um Item desta Área Comum.'
        },
        delete: {
            title: 'Remover Item de Área Comum',
            content: 'Remova um Item desta Área Comum.'
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
    const _onSubmit = async (data: CondominiumCommonAreaItemType): Promise<void> => {
        const commonPayload = {
            id: data.id,
            description: data.description,
            quantity_of_items: data.quantity_of_items,
            unitary_value: data.unitary_value,
            fk_condominium_common_area: data.fk_condominium_common_area,

            item_brand: data.item_brand,
            item_model: data.item_model,
            date_of_acquisition: data.date_of_acquisition,
            observations: data.observations
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
            add: () => wrapDispatch(addCondominiumCommonAreaItem({ ...commonPayload, id: '0' })),
            view: () => Promise.resolve({}),
            edit: () => wrapDispatch(updateCondominiumCommonAreaItem(commonPayload)),
            delete: () =>
                wrapDispatch(
                    deleteCondominiumCommonAreaItem({
                        id: data.id,
                        condominimCommonArea: data.fk_condominium_common_area
                    })
                )
        }

        const dispatchAction = actionDispatchMap[actionType]

        if (!dispatchAction) {
            console.error('Unknown action type')

            return
        }

        const actionResult: { error?: string } | undefined = await dispatchAction()
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
                            {`Esta ação irá excluir permanentemente o Item de Área Comum. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='description'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        required
                                        value={value}
                                        disabled={formDisabled}
                                        label='Descrição'
                                        onChange={onChange}
                                        placeholder='Vídeo Game PlayStation 5'
                                        error={Boolean(errors.description)}
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

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='quantity_of_items'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        required
                                        type='number'
                                        value={value}
                                        disabled={formDisabled}
                                        label='Quantidade'
                                        onChange={onChange}
                                        placeholder='1'
                                        error={Boolean(errors.quantity_of_items)}
                                    />
                                )}
                            />
                            {errors.quantity_of_items && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.quantity_of_items.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='unitary_value'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        required
                                        value={value}
                                        disabled={formDisabled}
                                        label='Valor Unitário'
                                        onChange={onChange}
                                        placeholder='299.99'
                                        error={Boolean(errors.unitary_value)}
                                    />
                                )}
                            />
                            {errors.unitary_value && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.unitary_value.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <Typography variant='caption' sx={{ mt: 2, ml: 1 }}>
                            Campos opcionais.
                        </Typography>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='item_model'
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        disabled={formDisabled}
                                        label='Modelo'
                                        onChange={onChange}
                                        placeholder='PlayStation 5'
                                        error={Boolean(errors.item_model)}
                                    />
                                )}
                            />
                            {errors.item_model && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.item_model.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='item_brand'
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        disabled={formDisabled}
                                        label='Marca'
                                        onChange={onChange}
                                        placeholder='Sony'
                                        error={Boolean(errors.item_brand)}
                                    />
                                )}
                            />
                            {errors.item_brand && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.item_brand.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='date_of_acquisition'
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        value={value}
                                        disabled={formDisabled}
                                        placeholder='01/01/1990'
                                        type={value || focus ? 'date' : 'text'}
                                        label='Data de Aquisição'
                                        onChange={onChange}
                                        error={Boolean(errors.date_of_acquisition)}
                                    />
                                )}
                            />
                            {errors.date_of_acquisition && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.date_of_acquisition.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='observations'
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        multiline
                                        rows={4}
                                        value={value}
                                        disabled={formDisabled}
                                        label='Observações'
                                        onChange={onChange}
                                        placeholder='Observações'
                                        error={Boolean(errors.observations)}
                                    />
                                )}
                            />
                            {errors.observations && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.observations.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            {!inViewMode && (
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
            )}
        </Dialog>
    )
}

export default CondominiumCommonAreaItemActionsDialog
