// ** React Imports
import { forwardRef, ReactElement, Ref, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState, useAppDispatch } from 'src/store'

// ** Action Imports
import { updateCondominiumCommonAreaTabReservationSubTabConfig } from 'src/store/apps/condominium/condominium-common-area-detail'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { displayToast } from 'src/views/utils/displayToast'

// ** Custom Styles
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const REQUIRED_FIELD_ERROR = 'Este campo é obrigatório!'

// ** Yup Schema
const schema = yup.object().shape({
    id: yup.string().required(REQUIRED_FIELD_ERROR),
    does_it_have_usage_fee: yup.boolean().required(REQUIRED_FIELD_ERROR),
    does_it_allows_reservation_to_defaulters: yup.boolean().required(REQUIRED_FIELD_ERROR),
    does_it_have_entry_checklist: yup.boolean().required(REQUIRED_FIELD_ERROR),
    does_it_have_exit_checklist: yup.boolean().required(REQUIRED_FIELD_ERROR)
})

// ** Interfaces
interface ReservationsSubTabConfigData {
    id: string
    does_it_have_usage_fee: boolean
    does_it_allows_reservation_to_defaulters: boolean
    does_it_have_entry_checklist: boolean
    does_it_have_exit_checklist: boolean
}

const TabReservasViewTabConfig = () => {
    // State
    const [formDisabled, setFormDisabled] = useState(true)
    const [confirmationOfUpdatesDialogOpen, setConfirmationOfUpdatesDialogOpen] = useState(false)

    // Redux
    const dispatch = useAppDispatch()
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const commonArea = store.commonArea

    // ** Default Values
    const defaultValues = {
        id: commonArea.id,
        does_it_have_usage_fee: commonArea.does_it_have_usage_fee,
        does_it_allows_reservation_to_defaulters: commonArea.does_it_allows_reservation_to_defaulters,
        does_it_have_entry_checklist: commonArea.does_it_have_entry_checklist,
        does_it_have_exit_checklist: commonArea.does_it_have_exit_checklist
    }

    // Form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema)
    })

    // Form Handlers
    const toggleFormDisabled = () => {
        setFormDisabled(!formDisabled)
    }

    // ** Hold Form Submit confirmation screen if for has errors
    const formHasErrors = Object.keys(errors).length > 0

    const onSubmit = (data: ReservationsSubTabConfigData) => {
        dispatch(
            updateCondominiumCommonAreaTabReservationSubTabConfig({
                id: data.id,
                does_it_have_usage_fee: data.does_it_have_usage_fee,
                does_it_allows_reservation_to_defaulters: data.does_it_allows_reservation_to_defaulters,
                does_it_have_entry_checklist: data.does_it_have_entry_checklist,
                does_it_have_exit_checklist: data.does_it_have_exit_checklist
            })
        )
        toggleUpdateAreaComumInfoDialog()
        toggleFormDisabled()
        displayToast({ success: 'Configurações de Reserva atualizadas com sucesso!' })
    }

    const toggleUpdateAreaComumInfoDialog = () => {
        if (!formHasErrors) {
            setConfirmationOfUpdatesDialogOpen(!confirmationOfUpdatesDialogOpen)
        }
    }

    const handleCancel = () => {
        reset()
        toggleFormDisabled()
    }

    return (
        <CardContent>
            <Grid container spacing={7}>
                <Grid item sm={12} xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl>
                            <Controller
                                name='does_it_have_usage_fee'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Switch disabled={formDisabled} value={value} onChange={onChange} checked={value} />
                                )}
                            />
                        </FormControl>
                        <Box>
                            <Box>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                    Possui Taxa de Reserva?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl>
                            <Controller
                                name='does_it_allows_reservation_to_defaulters'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Switch disabled={formDisabled} value={value} onChange={onChange} checked={value} />
                                )}
                            />
                        </FormControl>
                        <Box>
                            <Box>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                    Permite Reserva à Inadimplente?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
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
                            <Button
                                variant='contained'
                                sx={{ marginRight: 3.5 }}
                                type='submit'
                                onClick={() => {
                                    toggleUpdateAreaComumInfoDialog()
                                }}
                            >
                                Salvar Alterações
                            </Button>

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

            <Dialog
                fullWidth
                open={confirmationOfUpdatesDialogOpen}
                maxWidth='md'
                scroll='body'
                onClose={() => toggleUpdateAreaComumInfoDialog()}
                TransitionComponent={Transition}
                onBackdropClick={() => toggleUpdateAreaComumInfoDialog()}
            >
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton
                        size='small'
                        onClick={() => toggleUpdateAreaComumInfoDialog()}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Close />
                    </IconButton>

                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Atualizar Configurações de Reserva
                        </Typography>
                        <Typography variant='body2'>Altere as configurações de reserva desta Área Comum.</Typography>
                    </Box>

                    <Box sx={{ mb: 8 }}>
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá alterar as Configurações de Reserva desta Área Comum e poderá influenciar em documentações em diversos módulos do sistema!\n
            Caso tenha certeza, clique em "Atualizar Configurações de Reserva".`}
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button variant='contained' type='submit' sx={{ marginRight: 1 }} onClick={handleSubmit(onSubmit)}>
                        Atualizar Configurações de Reserva
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => toggleUpdateAreaComumInfoDialog()}>
                        Retornar à Edição
                    </Button>
                </DialogActions>
            </Dialog>
        </CardContent>
    )
}

export default TabReservasViewTabConfig
