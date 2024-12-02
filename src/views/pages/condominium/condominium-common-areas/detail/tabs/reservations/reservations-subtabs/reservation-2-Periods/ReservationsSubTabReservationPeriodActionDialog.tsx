// ** React Imports
import { forwardRef, ReactElement, Ref, useEffect, useMemo, useState } from 'react'

// ** Redux Store
import { useDispatch, useSelector } from 'react-redux'

// ** Redux Store
import { RootState } from 'src/store'
import {
    addCondominiumCommonAreaReservationPeriod,
    deactivateCondominiumCommonAreaReservationPeriod
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
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Type Imports
import { CondominiumCommonAreaReservationPeriodType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationPeriodTypes'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const schema = yup.object().shape({
    fk_condominium_common_area: yup.string().required(),
    is_full_day: yup.boolean(),
    start_time: yup.string().when('is_full_day', {
        is: false,
        then: yup.string().required('Caso não seja período integral, é obrigatório informar o horário de início'),
        otherwise: yup.string().notRequired().nullable()
    }),
    end_time: yup.string().when('is_full_day', {
        is: false,
        then: yup.string().required('Caso não seja período integral, é obrigatório informar o horário de término'),
        otherwise: yup.string().notRequired().nullable()
    })
})

interface ReservationPeriodActionsDialogActionsDialogInterface {
    actionType: 'add' | 'delete'
    actionData: CondominiumCommonAreaReservationPeriodType | undefined
    open: boolean
    toggle: () => void
    numberOfPeriods: number
}

const ReservationPeriodActionsDialog = ({
    actionType,
    actionData,
    open,
    toggle,
    numberOfPeriods
}: ReservationPeriodActionsDialogActionsDialogInterface) => {
    // ** States
    const [horarioInicioFocused, setHorarioInicioFocused] = useState(false)
    const [horarioTerminoFocused, setHorarioTerminoFocused] = useState(false)

    const horarioInicioOnFocus = () => setHorarioInicioFocused(true)
    const horarioTerminoOnFocus = () => setHorarioTerminoFocused(true)

    const horarioInicioOnBlur = () => setHorarioInicioFocused(false)
    const horarioTerminoOnBlur = () => setHorarioTerminoFocused(false)

    //** Store */
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const { commonArea, commonAreaReservationPeriods } = store

    const defaultValues = useMemo(
        () => ({
            fk_condominium_common_area: commonArea.id,
            is_full_day: false,
            start_time: '',
            end_time: '',
            is_period_active: true
        }),
        [commonArea.id]
    )

    // ** Hooks
    const dispatch = useDispatch()

    const {
        reset,
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (actionType !== 'add') {
            reset({
                ...defaultValues,
                ...actionData
            })
        } else {
            reset(defaultValues)
        }
    }, [actionType, actionData, reset, defaultValues])

    const commonAreaAlreadyHasReservationPeriodWithTimedConstraint = useMemo(() => {
        const hasReservationPeriodWithTimedConstraint = commonAreaReservationPeriods.some(
            reservationPeriod => !reservationPeriod.is_full_day
        )

        return hasReservationPeriodWithTimedConstraint
    }, [commonAreaReservationPeriods])

    const shouldDisableIsFullDaySwitch = useMemo(() => {
        if (commonAreaAlreadyHasReservationPeriodWithTimedConstraint) {
            return true
        }

        return false
    }, [commonAreaAlreadyHasReservationPeriodWithTimedConstraint])

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Período de Reserva de Área Comum',
            content: 'Insira um Período de Reserva nesta Área Comum.'
        },
        delete: {
            title: 'Remover Período de Reserva de Área Comum',
            content: 'Remova um Período de Reserva desta Área Comum.'
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
    const _onSubmit = async (data: CondominiumCommonAreaReservationPeriodType): Promise<void> => {
        const commonPayload = {
            id: data.id,
            fk_condominium_common_area: data.fk_condominium_common_area,
            is_full_day: data.is_full_day,
            start_time: data.start_time,
            end_time: data.end_time,
            is_period_active: true
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
            add: () => wrapDispatch(addCondominiumCommonAreaReservationPeriod({ ...commonPayload, id: '0' })),
            delete: () =>
                wrapDispatch(
                    deactivateCondominiumCommonAreaReservationPeriod({
                        id: data.id,
                        fk_condominium_common_area: data.fk_condominium_common_area
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

    const inDeactivationMode = actionType === 'delete'

    const isPeriodoIntegralSelected = watch('is_full_day')
    const horarioInicioGTHorarioTermino = watch('start_time') > watch('end_time')
    const horarioTerminoTouched = watch('end_time') !== ''

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
                    {actionType === 'delete' && numberOfPeriods > 1 && !actionData?.have_any_reservation_for_future && (
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá excluir permanentemente o Período de Reserva de Área Comum. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                    {actionType === 'delete' &&
                        numberOfPeriods == 1 &&
                        !actionData?.have_any_reservation_for_future && (
                            <Alert severity='warning'>
                                <AlertTitle>Atenção!</AlertTitle>
                                {`Esse é o único período de reserva da área comum. Ao excluí-lo, não será mais possível realizar reservas para essa área comum.`}
                            </Alert>
                        )}

                    {actionType === 'delete' && actionData?.have_any_reservation_for_future && (
                        <Alert severity='error'>
                            <AlertTitle>Erro!</AlertTitle>
                            {`Esta ação não pode ser realizada, por existirem reservas futuras com esse período. Por favor, verifique as reservas e tente novamente!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={7} xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <Tooltip
                            title={
                                shouldDisableIsFullDaySwitch
                                    ? 'Área comum já possui reservas com horário de início e término. Não é possível adicionar reservas apenas para o dia inteiro.'
                                    : 'Área comum disponibiliza reservas apenas para o dia inteiro?'
                            }
                            placement='bottom-start'
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box>
                                    <Box sx={{ marginLeft: 3 }}>
                                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            Período Integral?
                                        </Typography>
                                    </Box>
                                </Box>
                                <FormControl>
                                    <Controller
                                        name='is_full_day'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                disabled={shouldDisableIsFullDaySwitch || inDeactivationMode}
                                                value={value}
                                                checked={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='start_time'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        disabled={isPeriodoIntegralSelected || inDeactivationMode}
                                        value={value}
                                        onFocus={horarioInicioOnFocus}
                                        onBlur={horarioInicioOnBlur}
                                        type={horarioInicioFocused ? 'time' : 'text'}
                                        label='Horário Início'
                                        onChange={onChange}
                                        placeholder='12:00'
                                        error={Boolean(errors.start_time)}
                                    />
                                )}
                            />
                            {errors.start_time && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.start_time.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='end_time'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        disabled={isPeriodoIntegralSelected || inDeactivationMode}
                                        value={value}
                                        onFocus={horarioTerminoOnFocus}
                                        onBlur={horarioTerminoOnBlur}
                                        type={horarioTerminoFocused ? 'time' : 'text'}
                                        label='Horário Término'
                                        onChange={onChange}
                                        placeholder='18:00'
                                        error={Boolean(errors.end_time)}
                                    />
                                )}
                            />
                            {errors.end_time && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.end_time.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
                {horarioInicioGTHorarioTermino && horarioTerminoTouched && (
                    <>
                        <FormHelperText sx={{ color: 'warning.main', textAlign: 'center' }}>
                            O horário de término costuma ser maior que o horário de início. Verifique se os horários
                            estão corretos.
                        </FormHelperText>
                        <FormHelperText sx={{ color: 'success.main', textAlign: 'center' }}>
                            Caso seja um período intra-dia, desconsidere este aviso.
                        </FormHelperText>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <Button
                    variant='contained'
                    type='submit'
                    color={actionType === 'delete' ? 'error' : 'primary'}
                    disabled={actionData?.have_any_reservation_for_future || submitLoading}
                    onClick={handleSubmit(onSubmit)}
                    sx={{ marginRight: 1 }}
                >
                    {actionType === 'add' && 'Salvar'}
                    {actionType === 'delete' && 'Excluir'}
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReservationPeriodActionsDialog
