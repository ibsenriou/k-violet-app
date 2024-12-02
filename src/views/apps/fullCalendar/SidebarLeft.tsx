// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Types
import { SidebarLeftType, CalendarFiltersType } from 'src/@types/apps/condominiumCalendarEventAgendaTypes'


const SidebarLeft = (props: SidebarLeftType) => {
  const {
    mdAbove,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,

    selectedCalendars
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
        return (
          <FormControlLabel
            key={key}
            label={
              key === 'meetingcalendarevent'
                ? 'Reuniões'
                : key === 'repaircalendarevent'
                ? 'Reparos'
                : 'Mudanças'
            }
            control={
              <Checkbox

                checked={selectedCalendars.includes(key as CalendarFiltersType)}
                onChange={() => handleCalendarsUpdate(key as CalendarFiltersType)}
                sx={{ color: `${value}.main`, '&.Mui-checked': { color: `${value}.main` } }}
              />
            }
          />
        )
      })
    : null

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()
    handleSelectEvent(null)
  }

  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            zIndex: mdAbove ? '2' : 'drawer',
            padding: theme => theme.spacing(5),
            position: mdAbove ? 'static' : 'absolute'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        <Button variant='contained' onClick={handleSidebarToggleSidebar}>
          Adicionar Evento
        </Button>

        <Typography variant='caption' sx={{ mt: 7, mb: 2, textTransform: 'uppercase' }}>
          Calendários
        </Typography>
        <FormControlLabel
          label='Ver Todos'
          control={
            <Checkbox
              color='secondary'
              checked={selectedCalendars.length === colorsArr.length}
              onChange={e => handleAllCalendars(e.target.checked)}
            />
          }
        />
        {renderFilters}
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
