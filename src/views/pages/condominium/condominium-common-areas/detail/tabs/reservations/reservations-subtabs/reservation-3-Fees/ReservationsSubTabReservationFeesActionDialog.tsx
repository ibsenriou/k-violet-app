// ** React Imports
import { forwardRef, ReactElement, Ref, useState } from 'react'

// ** Redux Store
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch, useAppSelector } from 'src/store'

// ** Redux Actions
import { addCondominiumCommonAreaUtilizationFeeHistory } from 'src/store/apps/condominium/condominium-common-area-detail'

// ** MUI Imports
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

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** React Hook Form
import { Controller, useForm } from 'react-hook-form'

// ** Types
import { CondominiumCommonAreaUtilizationFeeHistoryType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaUtilizationFeeHistoryTypes'
import { selectUser } from 'src/store/apps/user'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const schema = yup.object().shape({
    value: yup
        .number()
        .typeError('Valor deve ser um número')
        .required('Campo obrigatório')
        .min(0, 'Valor deve ser maior que 0')
        .moreThan(0, 'Valor deve ser maior que 0'),
    date_since_its_valid: yup.string().required('Campo obrigatório')
})

const defaultValues = {
    fk_common_area: '0',
    value: 0,
    date_since_its_valid: ''
}

interface ReservationsSubTabReservationFeesActionDialogType {
    open: boolean
    toggle: () => void
}

const ReservationsSubTabReservationFeesActionDialog = ({
    open,
    toggle
}: ReservationsSubTabReservationFeesActionDialogType) => {
    //** Store */
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    // Get the id of the logged in user to pass to the API in the created_by field
    // TODO - Ts temporary ignore the error until the user type is fixed to use id instead of pk
    // @ts-ignore

    const user = useAppSelector(selectUser)
    const userId = user?.id
    const commonAreaId = store.commonArea.id

    // ** States
    const [focus, setFocused] = useState(false)

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    // ** Hooks
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

    const onSubmit = (data: CondominiumCommonAreaUtilizationFeeHistoryType) => {
        dispatch(
            addCondominiumCommonAreaUtilizationFeeHistory({ ...data, fk_common_area: commonAreaId, created_by: userId })
        )
        toggle()
        reset()
    }

    const handleClose = () => {
        toggle()
        reset()
    }

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
                        Adicionar Valor de Reserva de Área Comum
                    </Typography>
                    <Typography variant='body2'>Insira uma valor de reserva nesta área comum.</Typography>
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='value'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        type='number'
                                        label='Valor'
                                        onChange={onChange}
                                        placeholder='5.50'
                                        error={Boolean(errors.value)}
                                    />
                                )}
                            />
                            {errors.value && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.value.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='date_since_its_valid'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        value={value}
                                        type={value || focus ? 'date' : 'text'}
                                        label='Valido Desde'
                                        onChange={onChange}
                                        error={Boolean(errors.date_since_its_valid)}
                                    />
                                )}
                            />
                            {errors.date_since_its_valid && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.date_since_its_valid.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <Button variant='contained' type='submit' onClick={handleSubmit(onSubmit)} sx={{ marginRight: 1 }}>
                    Salvar
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReservationsSubTabReservationFeesActionDialog
