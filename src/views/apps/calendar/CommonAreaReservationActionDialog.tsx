// ** React Imports
import { forwardRef, Fragment, ReactElement, Ref, useCallback, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Styled Components
import DatePickerWrapper from '@core/styles/libs/react-datepicker'

// ** Types
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { AddEventSidebarType, EventDateType } from '@typesApiMapping/apps/calendarTypes'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useService from 'src/hooks/useService'
import { LookupsService } from 'src/services/lookupsService'
import { RootState } from 'src/store'


import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { ptBR } from 'date-fns/locale'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { usePermission } from 'src/context/PermissionContext'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  id: string | number
  fk_uhab_as_reservant: string
  fk_common_area_reservation_period: string
  fk_condominium_common_area: string
  allDay: boolean
  endDate: Date | string
  startDate: Date | string
  created_by: string
}

// ** Custom Styles
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const defaultState: DefaultStateType = {
  id: 0,
  fk_uhab_as_reservant: '0',
  fk_common_area_reservation_period: '0',
  fk_condominium_common_area: '0',
  allDay: true,
  endDate: new Date(),
  startDate: new Date(),
  created_by: ''
}

const CommonAreaReservationActionDialog = (props: AddEventSidebarType) => {
  // ** Props
  const {
    store,
    units,
    selectedCondominiumCommonAreaName: condominiumCommonAreaName,
    availableReservationDates: availableDates,
    dispatch,
    addEvent,
    updateEvent,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  const [isConfirmExclusionDialogOpen, setIsConfirmExclusionDialogOpen] = useState(false)
  const toggleConfirmExclusionDialog = () => setIsConfirmExclusionDialogOpen(!isConfirmExclusionDialogOpen)

  const reservationPeriods = useSelector(
    (state: RootState) => state.condominiumCommonAreaDetail.commonAreaReservationPeriods
  )
  const { data: lookupTypeOfResidentialList } = useService(LookupsService.lookup_type_of_residential)
  const { data: lookupTypeOfCommercialList } = useService(LookupsService.lookup_type_of_commercial)

  // ** States
  const [values, setValues] = useState<DefaultStateType>(defaultState)

  const { setValue, clearErrors, handleSubmit } = useForm()
  const permissions = usePermission('condominium.common_area')

  const handleCommonAreaReservationActionDialogClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      const commonAreaId = router.query.id as string
      setValues({ ...values, fk_condominium_common_area: commonAreaId })
    }
  }, [router.query.id])

  const onSubmit = () => {
    const modifiedEvent = {
      fk_condominium_common_area: router.query.id as string,
      fk_uhab_as_reservant: values.fk_uhab_as_reservant,
      fk_common_area_reservation_period: values.fk_common_area_reservation_period,
      reservation_date: values.startDate,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      created_by: values.created_by
    }
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent?.title?.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleCommonAreaReservationActionDialogClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    handleCommonAreaReservationActionDialogClose()
  }

  const handleStartDate = (date: Date) => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent

      setValues({
        id: event.id,
        fk_uhab_as_reservant: event?.extendedProps?.fk_uhab_as_reservant || (units && units[0].id) || '0',
        fk_common_area_reservation_period:
          event?.extendedProps?.fk_common_area_reservation_period ||
          (reservationPeriods && reservationPeriods[0].id) ||
          '0',
        fk_condominium_common_area:
          event?.extendedProps?.fk_condominium_common_area || (router.query.id as string) || '0',
        allDay: event.allDay,
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date(),
        created_by: event.extendedProps?.created_by || ''
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues({
      ...defaultState,
      fk_uhab_as_reservant: units?.length ? units[0].id : '0',
      fk_common_area_reservation_period: reservationPeriods?.length ? reservationPeriods[0].id : '0'
    })
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent?.title?.length)) {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Adicionar
          </Button>
          <Button
            size='large'
            variant='outlined'
            color='secondary'
            onClick={handleCommonAreaReservationActionDialogClose}
          >
            Cancelar
          </Button>
        </Fragment>
      )
    } else {
      {
        return (
          <Fragment>
            <Button 
              size='large' 
              type='submit' 
              variant='contained' 
              sx={{ mr: 4 }} 
              disabled={!permissions.can("reservation:update", {
                created_by: values.created_by,
                fk_uhab_as_reservant: values.fk_uhab_as_reservant,
              })}
            >
              Atualizar
            </Button>
            <Button
              size='large'
              variant='outlined'
              color='secondary'
              onClick={handleCommonAreaReservationActionDialogClose}
              sx={{ mr: 4 }}
            >
              Cancelar
            </Button>
            <Button
              size='large'
              variant='contained'
              color='error'
              onClick={toggleConfirmExclusionDialog}
              disabled={!permissions.can("reservation:delete", {
                created_by: values.created_by,
                fk_uhab_as_reservant: values.fk_uhab_as_reservant,
              })}
            >
              Excluir
            </Button>

            {isConfirmExclusionDialogOpen && (
              <>
                <Dialog
                  fullWidth
                  open={isConfirmExclusionDialogOpen}
                  maxWidth='md'
                  scroll='body'
                  onClose={() => toggleConfirmExclusionDialog()}
                  onBackdropClick={() => toggleConfirmExclusionDialog()}
                >
                  <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton
                      size='small'
                      onClick={() => toggleConfirmExclusionDialog()}
                      sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                      <Close />
                    </IconButton>

                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                      <Typography variant='h5' sx={{ mb: 3 }}>
                        Remover Reserva
                      </Typography>
                      <Typography variant='body2'>Remova uma reserva nesta Área Comum</Typography>
                    </Box>

                    <Box sx={{ mb: 8 }}>
                      <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        Esta ação irá excluir esta Reserva desta Área Comum! Caso tenha certeza, clique em "Excluir Reserva".
                      </Alert>
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button
                      color='error'
                      variant='contained'
                      type='submit'
                      sx={{ marginRight: 1 }}
                      onClick={() => {
                        toggleConfirmExclusionDialog()
                        handleDeleteEvent()
                      }}
                    >
                      Excluir Reserva
                    </Button>
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={toggleConfirmExclusionDialog}
                    >
                      Cancelar
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}


          </Fragment>
        )
      }
    }
  }

  return (
    <Dialog
      open={addEventSidebarOpen}
      onClose={handleCommonAreaReservationActionDialogClose}
      sx={{ '& .MuiDrawer-paper': { width: '100%' } }}
      fullWidth
      maxWidth='md'
      scroll='paper'
      TransitionComponent={Transition}
      onBackdropClick={() => handleCommonAreaReservationActionDialogClose()}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => handleCommonAreaReservationActionDialogClose()}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Close />
          </IconButton>

          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              {store.selectedEvent !== null && store.selectedEvent?.title?.length
                ? 'Atualizar Reserva'
                : 'Nova Reserva'}
            </Typography>
            <Typography variant='body2'>{condominiumCommonAreaName}</Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item sm={12} xs={12}>
              <DatePickerWrapper>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='title'>Unidade Reservante</InputLabel>
                  <Select
                    label='Unidade Reservante'
                    value={values.fk_uhab_as_reservant}
                    labelId='Unidade-Reservante'
                    required
                    onChange={e => setValues({ ...values, fk_uhab_as_reservant: e.target.value })}
                  >
                    {units &&
                      units.map(unit => {
                        if ((unit as ResidentialType).fk_lookup_type_of_residential) {
                          const residentialType = lookupTypeOfResidentialList?.find(
                            type =>
                              type.id ===
                              (unit as ResidentialType).fk_lookup_type_of_residential
                          )?.description
                          return (
                            <MenuItem key={unit.id} value={unit.id}>
                              {residentialType} {unit.name}
                            </MenuItem>
                          )
                        }
                        if ((unit as CommercialType).fk_lookup_type_of_commercial) {
                          const residentialType = lookupTypeOfCommercialList?.find(
                            type =>
                              type.id ===
                              (unit as CommercialType).fk_lookup_type_of_commercial
                          )?.description
                          return (
                            <MenuItem key={unit.id} value={unit.id}>
                              {residentialType} {unit.name}
                            </MenuItem>
                          )
                        }
                      })}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='title'>Período da Reserva</InputLabel>
                  <Select
                    label='Período da Reserva'
                    value={values.fk_common_area_reservation_period}
                    labelId='fk_common_area_reservation_period'
                    required
                    onChange={e =>
                      setValues({
                        ...values,
                        fk_common_area_reservation_period: String(e.target.value)
                      })
                    }
                  >
                    {reservationPeriods &&
                      reservationPeriods.map(reservationPeriod => {
                        return (
                          <MenuItem key={reservationPeriod.id} value={reservationPeriod.id}>
                            {reservationPeriod.is_full_day
                              ? 'Dia Inteiro'
                              : `${reservationPeriod.start_time.slice(
                                0,
                                -3
                              )} - ${reservationPeriod.end_time.slice(0, -3)}`}
                          </MenuItem>
                        )
                      })}
                  </Select>
                </FormControl>
                <Box sx={{ mb: 8 }}>
                  <DatePicker
                    locale={ptBR}
                    selectsStart
                    id='event-start-date'
                    selected={values.startDate as EventDateType}
                    startDate={values.startDate as EventDateType}
                    showTimeSelect={!values.allDay}
                    dateFormat={!values.allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
                    customInput={
                      <PickersComponent label='Data da Reserva' registername='startDate' />
                    }
                    onChange={(date: Date) => setValues({ ...values, startDate: new Date(date) })}
                    onSelect={handleStartDate}
                    disabledDayAriaLabelPrefix='Dia desabilitado'
                    disabledKeyboardNavigation
                    includeDates={availableDates}
                  />
                </Box>
              </DatePickerWrapper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <RenderSidebarFooter />
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CommonAreaReservationActionDialog
