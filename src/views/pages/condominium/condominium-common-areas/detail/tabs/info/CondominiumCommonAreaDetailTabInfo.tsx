// ** React Imports
import { forwardRef, ReactElement, Ref, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState } from 'src/store'
import { updateCondominiumCommonArea } from 'src/store/apps/condominium/condominium-common-area-detail'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import FormHelperText from '@mui/material/FormHelperText'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Custom Components Imports
import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'

// ** Custom Hooks
import { useWrapDispatch } from 'src/hooks/useWrapDispatch'

// ** Utils
import { displayToast } from 'src/views/utils/displayToast'

// ** Custom Styles
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

// ** Yup Schema
const requiredFieldMessage = 'Este campo é obrigatório!'
const positiveNumberMessage = 'Este campo não pode ser negativo ou zero!'

const schema = yup.object().shape({
    id: yup.string().required(requiredFieldMessage),
    name: yup.string().required(requiredFieldMessage),
    description: yup.string().required(requiredFieldMessage),
    capacity_of_people: yup
        .number()
        .required(requiredFieldMessage)
        .min(1, positiveNumberMessage)
        .typeError(requiredFieldMessage),
    does_it_requires_reservation: yup.boolean().required(requiredFieldMessage),
    does_it_allows_guests: yup.boolean().required(requiredFieldMessage)
})

interface AreaComumViewTabInfoProps {
    changeTabToReservas: () => void
}

const CondominiumCommonAreaDetailTabInfo = ({ changeTabToReservas }: AreaComumViewTabInfoProps) => {
    // ** State
    const [formDisabled, setFormDisabled] = useState(true)
    const [confirmationOfUpdatesDialogOpen, setConfirmationOfUpdatesDialogOpen] = useState(false)

    const wrapDispatch = useWrapDispatch()

    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const { commonArea, commonAreaReservationPeriods } = store

    // ** Default Values
    const defaultValues = {
        id: commonArea.id,
        name: commonArea.name,
        description: commonArea.description,
        capacity_of_people: commonArea.capacity_of_people,
        does_it_requires_reservation: commonArea.does_it_requires_reservation,
        does_it_allows_guests: commonArea.does_it_allows_guests,
        working_week_days: commonArea.working_week_days
    }

    // ** React Hook Form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        defaultValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema)
    })

    // Form Handlers
    const toggleForm = () => {
        setFormDisabled(!formDisabled)
    }

    // ** Hold Form Submit confirmation screen if for has errors
    const formHasErrors = Object.keys(errors).length > 0

    const onSubmit = async (data: CondominiumCommonAreaType) => {
        /**
         * Wraps the Redux dispatch action in a standard Promise object.
         * @param action The Redux action to dispatch.
         * @returns A promise resolving to an object containing an optional error string.
         */
        const actionResult = await wrapDispatch(
            updateCondominiumCommonArea({
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
                fk_condominium_common_area_utilization_fee_history:
                    data.fk_condominium_common_area_utilization_fee_history,

                working_week_days: data.working_week_days
            })
        )

        displayToast(actionResult)

        toggleUpdateAreaComumInfoDialog()
        toggleForm()
    }

    /**
     * This function is responsible for handling the changes in the working week days.
     *
     * It receives the event from the switch component and then changes the working week days string.
     */
    const handleEditWorkingWeekDays = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dayOfWeek = event.target.value
        const dayOfWeekIndex = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].indexOf(dayOfWeek)
        const newWorkingWeekDays = watch('working_week_days').split('')
        newWorkingWeekDays[dayOfWeekIndex] = newWorkingWeekDays[dayOfWeekIndex] == '1' ? '0' : '1'
        setValue('working_week_days', newWorkingWeekDays.join(''))
    }

    const toggleUpdateAreaComumInfoDialog = () => {
        if (!formHasErrors) {
            setConfirmationOfUpdatesDialogOpen(!confirmationOfUpdatesDialogOpen)
        }
    }

    const handleCancel = () => {
        reset()
        toggleForm()
    }

    return (
        <CardContent>
            {commonArea.does_it_requires_reservation && commonAreaReservationPeriods.length === 0 && (
                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Você habilitou a configuração de Reservas para área comum. Por favor, cadastre os períodos de reservas
            antes de proceder.`}
                        <Box mb={3} mt={5}>
                            <Button variant='contained' color='warning' onClick={changeTabToReservas}>
                                Cadastrar Períodos de Reservas
                            </Button>
                        </Box>
                    </Alert>
                </Box>
            )}

            <Grid container spacing={7}>
                <Grid item sm={9} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    disabled={formDisabled}
                                    value={value}
                                    label='Nome'
                                    onChange={onChange}
                                    placeholder='Nome do Condomínio'
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item sm={3} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='capacity_of_people'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    type='number'
                                    disabled={formDisabled}
                                    value={value}
                                    label='Capacidade'
                                    onChange={onChange}
                                    placeholder='Capacidade'
                                    error={Boolean(errors.capacity_of_people)}
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
                                    multiline
                                    rows={4}
                                    disabled={formDisabled}
                                    value={value}
                                    label='Descrição'
                                    onChange={onChange}
                                    placeholder='Descrição'
                                    error={Boolean(errors.description)}
                                />
                            )}
                        />
                        {errors.description && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item sm={6} xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl>
                            <Controller
                                name='does_it_requires_reservation'
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
                                    Necessita Reserva?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl>
                            <Controller
                                name='does_it_allows_guests'
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
                                    Permite Convidados?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item sm={12} xs={12}>
                    <CardHeader
                        title='Dias de Funcionamento'
                        titleTypographyProps={{ variant: 'body1', align: 'center' }}
                    />

                    <Divider sx={{ margin: 0 }} />

                    <TableContainer>
                        <Table sx={{ minWidth: 500 }}>
                            <TableHead
                                sx={{
                                    backgroundColor: theme =>
                                        theme.palette.mode === 'light' ? 'grey.50' : 'background.default'
                                }}
                            >
                                <TableRow>
                                    <TableCell align='center'>Domingo</TableCell>
                                    <TableCell align='center'>Segunda</TableCell>
                                    <TableCell align='center'>Terça</TableCell>
                                    <TableCell align='center'>Quarta</TableCell>
                                    <TableCell align='center'>Quinta</TableCell>
                                    <TableCell align='center'>Sexta</TableCell>
                                    <TableCell align='center'>Sábado</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow hover>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Domingo'}
                                            checked={watch('working_week_days')[0] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>

                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Segunda'}
                                            checked={watch('working_week_days')[1] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Terça'}
                                            checked={watch('working_week_days')[2] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Quarta'}
                                            checked={watch('working_week_days')[3] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Quinta'}
                                            checked={watch('working_week_days')[4] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Sexta'}
                                            checked={watch('working_week_days')[5] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important' }}
                                    >
                                        <Switch
                                            disabled={formDisabled}
                                            value={'Sábado'}
                                            checked={watch('working_week_days')[6] == '1'}
                                            onChange={handleEditWorkingWeekDays}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12}>
                    {formDisabled && (
                        <Button
                            variant='contained'
                            color='primary'
                            sx={{ marginRight: 3.5 }}
                            type='submit'
                            onClick={() => toggleForm()}
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
                            Atualizar Área Comum
                        </Typography>
                        <Typography variant='body2'>Altere as informações desta Área Comum.</Typography>
                    </Box>

                    <Box sx={{ mb: 8 }}>
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá alterar as informações desta Área Comum e poderá influenciar em documentações em diversos módulos do sistema!\n
            Caso tenha certeza, clique em "Atualizar Área Comum".`}
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button variant='contained' type='submit' sx={{ marginRight: 1 }} onClick={handleSubmit(onSubmit)}>
                        Atualizar Área Comum
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => toggleUpdateAreaComumInfoDialog()}>
                        Retornar à Edição
                    </Button>
                </DialogActions>
            </Dialog>
        </CardContent>
    )
}

export default CondominiumCommonAreaDetailTabInfo
