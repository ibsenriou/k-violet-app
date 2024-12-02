import { forwardRef, ReactElement, Ref, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InputMask from 'react-input-mask'

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

import { useAppDispatch } from 'src/store'
import { addContactInformation, deleteContactInformation, updateContactInformation } from 'src/store/apps/user'

import { LookupTypeOfContactInformationType } from '@typesApiMapping/apps/lookups/lookupTypeOfContactInformationTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'

import useService from 'src/hooks/useService'

import { LookupsService } from 'src/services/lookupsService'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface UserContactsActionsDialogProps {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: any | {}
    open: boolean
    toggle: () => void
    personId: string
}

const schema = yup.object().shape({
    description: yup.string().required('Este campo é obrigatório!'),
    fk_lookup_type_of_contact_information: yup.string().required('Este campo é obrigatório!')
})

const defaultValues: Partial<PersonContactInformationType> = {
    id: '0',
    fk_person: '',
    description: '',
    fk_lookup_type_of_contact_information: ''
}

const actionTypeConfig = {
    add: {
        title: 'Adicionar Contato',
        content: 'Insira um contato.'
    },
    edit: {
        title: 'Editar Contato',
        content: 'Altere suas informações de contato.'
    },
    delete: {
        title: 'Remover Contato',
        content: 'Remova as informações de seu contato.'
    },
    view: {
        title: 'Visualizar Contato',
        content: 'Visualize as informações de seu contato.'
    },
    default: {
        title: 'Error - Unknown Action Type',
        content: 'Error - Unknown Action Type'
    }
}

const UserContactsActionsDialog = ({
    actionType,
    actionData,
    open,
    toggle,
    personId
}: UserContactsActionsDialogProps) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    })

    const dispatch = useAppDispatch()

    const { data: typeContactInformationList } = useService(LookupsService.lookup_type_of_contact_information) as {
        data: LookupTypeOfContactInformationType[]
    }

    const { find: findContactInformationType } = useService(LookupsService.lookup_type_of_contact_information)

    const _onSubmit = async (data: Partial<PersonContactInformationType>): Promise<void> => {
        const commonPayload: Partial<PersonContactInformationType> = {
            id: data.id,
            fk_person: personId,
            description: data.description,
            fk_lookup_type_of_contact_information: data.fk_lookup_type_of_contact_information
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
            add: () => wrapDispatch(addContactInformation(commonPayload)),
            edit: () => wrapDispatch(updateContactInformation(commonPayload)),
            delete: () => wrapDispatch(deleteContactInformation(commonPayload)),
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
                    onClick={() => toggle()}
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
                            {`Esta ação irá excluir este contato e poderá influenciar em documentações em diversos módulos do sistema!\n
                            Caso tenha certeza, clique em "Excluir".`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='type-information-select'>Tipo de contato</InputLabel>
                            <Controller
                                name='fk_lookup_type_of_contact_information'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required={false}
                                        fullWidth
                                        value={value}
                                        id='type-information-select'
                                        label='Tipo de contato'
                                        labelId='type-information-select'
                                        onChange={e => {
                                            onChange(e)
                                            setValue('description', '')
                                        }}
                                        inputProps={{ placeholder: 'Selecione o tipo de contato' }}
                                        error={Boolean(errors.fk_lookup_type_of_contact_information)}
                                        disabled={
                                            actionType === 'view' || actionType === 'edit' || actionType === 'delete'
                                        }
                                    >
                                        {typeContactInformationList &&
                                            typeContactInformationList.map(type => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_lookup_type_of_contact_information && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.fk_lookup_type_of_contact_information.message}
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
                                    <InputMask
                                        mask={
                                            findContactInformationType(watch('fk_lookup_type_of_contact_information'))
                                                ?.description != 'E-mail'
                                                ? '(99) 99999-9999'
                                                : ''
                                        }
                                        maskChar=''
                                        value={value || ''}
                                        onChange={onChange}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {() => (
                                            <TextField
                                                value={value}
                                                label='Contato'
                                                onChange={onChange}
                                                placeholder={
                                                    findContactInformationType(
                                                        watch('fk_lookup_type_of_contact_information')
                                                    )?.description == 'E-mail'
                                                        ? 'email@gmail.com'
                                                        : '11999999999'
                                                }
                                                error={Boolean(errors.description)}
                                                disabled={actionType === 'view' || actionType === 'delete'}
                                            />
                                        )}
                                    </InputMask>
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

export default UserContactsActionsDialog
