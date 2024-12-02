// ** React Imports
import { forwardRef, Fragment, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'

// ** Icons Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import DialogComponent from '@core/components/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddEventSidebarType, EventDateType } from 'src/@types/apps/condominiumCalendarEventAgendaTypes'
import { CondominiumService } from 'src/services/condominiumService'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
}

const defaultState: DefaultStateType = {
  title: '',
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'meetingcalendarevent',
  startDate: new Date()
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // ** Props
  const {
    selectedEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  const queryClient = useQueryClient()

  // ** Mutations
  const addEventMutation = useMutation({
    mutationFn: (event: any) => {
      const eventForm = event.extendedProps.calendar

      return CondominiumService.condominium_calendar_event.post(null,
        {
          event_type: eventForm.toLowerCase(),
          ...event
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })

  const updateEventMutation = useMutation({
    mutationFn: (event: any) => {
      const eventForm = event.extendedProps.calendar;
      const eventId = event.id

      return CondominiumService.condominium_calendar_eventId.patch(
        { condominiumCalendarEventId: eventId },
        {
          event_type: eventForm.toLowerCase(),
          ...event
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => {
      return CondominiumService.condominium_calendar_eventId.delete({ condominiumCalendarEventId: eventId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })

  // ** States
  const [values, setValues] = useState<DefaultStateType>(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    handleSelectEvent(null)
    handleAddEventSidebarToggle()
  }

  const onSubmit = (data: { title: string }) => {
    const modifiedEvent = {
      id: selectedEvent !== null ? selectedEvent.id : null,
      display: 'block',
      title: data.title,
      description: values.description.length ? values.description : "",
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: values.calendar,
        description: values.description.length ? values.description : ""
      }
    }
    if (selectedEvent === null || (selectedEvent !== null && !selectedEvent.title.length)) {
      console.log('Add event mutation: ', modifiedEvent)
      addEventMutation.mutate(modifiedEvent)
    } else {
      console.log('Update event mutation: ', modifiedEvent)
      updateEventMutation.mutate(modifiedEvent)
    }

    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id)
    }
    handleSidebarClose()
  }

  const handleStartDate = (date: Date) => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (selectedEvent !== null) {
      const event = selectedEvent
      setValue('title', event.title || '')
      setValues({
        title: event.title || '',
        allDay: event.allDay,
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'meetingcalendarevent',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }
  }, [setValue, selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, selectedEvent])

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
    if (selectedEvent === null || (selectedEvent !== null && !selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Adicionar
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Atualizar
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>

          <Button size='large' variant='outlined' color='error' sx={{
            marginLeft: 'auto'

          }} onClick={handleDeleteEvent}>
            <DeleteOutline />
          </Button>
        </Fragment>
      )
    }
  }

  return (
    !addEventSidebarOpen ? null : (
      <DialogComponent
      title={selectedEvent !== null && selectedEvent.title.length ? 'Atualizar Evento' : 'Adicionar Evento'}
      description={
        selectedEvent !== null && selectedEvent.title.length
          ? 'Atualize o evento com as informações desejadas'
          : 'Adicione um novo evento com as informações desejadas'
      }
      onClose={handleSidebarClose}
    >

      <Box className='sidebar-body' sx={{ padding: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Título' value={value} onChange={onChange} error={Boolean(errors.title)} />
                )}
              />
              {errors.title && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-title-error'>
                  Esse campo é obrigatório
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-calendar'>Calendário</InputLabel>
              <Select

                // if selectedEvent, then this field is disabled because calendars are not editable
                disabled={selectedEvent !== null && !!selectedEvent.title.length}
                label='Calendário'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
              >
                <MenuItem value='meetingcalendarevent'>Reuniões</MenuItem>
                <MenuItem value='movingcalendarevent'>Mudanças</MenuItem>
                <MenuItem value='repaircalendarevent'>Reparos</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mb: 6 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate as EventDateType}
                selected={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Data Inicial' registername='startDate' />}
                onChange={(date: Date) => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 6 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate as EventDateType}
                selected={values.endDate as EventDateType}
                minDate={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Data Final' registername='endDate' />}
                onChange={(date: Date) => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box>
            <FormControl sx={{ mb: 6 }}>
              <FormControlLabel
                label='Dia inteiro'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>
            <TextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6 }}
              label='Descrição'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </DialogComponent>
    )

  )
}

export default AddEventSidebar
