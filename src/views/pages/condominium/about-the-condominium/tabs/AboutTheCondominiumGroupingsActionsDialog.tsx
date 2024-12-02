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

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { useAppDispatch } from 'src/store'
import {
    addAboutTheCondominiumGrouping,
    deleteAboutTheCondominiumGrouping,
    updateAboutTheCondominiumGrouping
} from 'src/store/apps/condominium/about-the-condominium'

import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'
import { LookupTypeOfCondominiumGroupingType } from '@typesApiMapping/apps/lookups/lookupTypeOfCondominiumGroupingTypes'

import useService from 'src/hooks/useService'

import { LookupsService } from 'src/services/lookupsService'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface AboutTheCondominiumContactsActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: any | {}
    open: boolean
    toggle: () => void
    condominiumId: string
}

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    description: yup.string().required('Este campo é obrigatório!'),
    fk_lookup_type_of_condominium_grouping: yup.string().required('Este campo é obrigatório!')
})

const defaultValues: Partial<CondominiumGroupingType> = {
    id: '0',
    name: '',
    description: '',
    fk_uhab: '',
    fk_lookup_type_of_condominium_grouping: ''
}

const actionTypeConfig = {
    add: {
        title: 'Adicionar Agrupamento',
        content: 'Insira um agrupamento neste condomínio.'
    },
    edit: {
        title: 'Editar Agrupamento',
        content: 'Altere as informações de um agrupamento deste condomínio.'
    },
    delete: {
        title: 'Remover Agrupamento',
        content: 'Remova um agrupamento deste condomínio.'
    },
    view: {
        title: 'Visualizar Agrupamento',
        content: 'Visualize as informações de um agrupamento deste condomínio.'
    },
    default: {
        title: 'Error - Unknown Action Type',
        content: 'Error - Unknown Action Type'
    }
}

const AboutTheCondominiumGroupingsActionsDialog = ({
    actionType,
    actionData,
    open,
    toggle,
    condominiumId
}: AboutTheCondominiumContactsActionsDialogInterface) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    })

    const dispatch = useAppDispatch()

    const { data: typeCondominiumGroupingList } = useService(LookupsService.lookup_type_of_condominium_grouping) as {
        data: LookupTypeOfCondominiumGroupingType[]
    }

    const _onSubmit = async (data: CondominiumGroupingType): Promise<void> => {
        const commonPayload = {
            name: data.name,
            description: data.description || '',
            fk_uhab: condominiumId || '',
            fk_lookup_type_of_condominium_grouping: data.fk_lookup_type_of_condominium_grouping
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
            add: () => wrapDispatch(addAboutTheCondominiumGrouping(commonPayload)),
            edit: () => wrapDispatch(updateAboutTheCondominiumGrouping({ id: data.id, ...commonPayload })),
            delete: () => wrapDispatch(deleteAboutTheCondominiumGrouping({ id: data.id, fk_uhab: data.fk_uhab || '' })),
            view: () => {} // do nothing
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
                            {`Esta ação irá excluir este agrupamento do Condomínio e poderá influenciar em documentações em diversos módulos do sistema!\n
                            Caso tenha certeza, clique em "Excluir".`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='type-grouping-select'>Tipo de agrupamento</InputLabel>
                            <Controller
                                name='fk_lookup_type_of_condominium_grouping'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required={false}
                                        fullWidth
                                        value={value}
                                        id='type-grouping-select'
                                        label='Tipo de agrupamento'
                                        labelId='type-grouping-select'
                                        onChange={onChange}
                                        inputProps={{ placeholder: 'Selecione o tipo de agrupamento' }}
                                        error={Boolean(errors.fk_lookup_type_of_condominium_grouping)}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {typeCondominiumGroupingList &&
                                            typeCondominiumGroupingList.map(type => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_lookup_type_of_condominium_grouping && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.fk_lookup_type_of_condominium_grouping.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

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
                                        placeholder='Nome do agrupamento'
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

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='description'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Descrição'
                                        onChange={onChange}
                                        placeholder='Descrição do agrupamento'
                                        error={Boolean(errors.description)}
                                        disabled={actionType === 'view' || actionType === 'delete'}
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

export default AboutTheCondominiumGroupingsActionsDialog
