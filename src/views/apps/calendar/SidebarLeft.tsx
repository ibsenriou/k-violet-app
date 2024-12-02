// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'

// ** Types
import { SidebarLeftType } from '@typesApiMapping/apps/calendarTypes'

const SidebarLeft = (props: SidebarLeftType) => {
    const { condominiumCommonAreaName, mdAbove, dispatch, handleSelectEvent, handleAddEventSidebarToggle } = props

    const handleOpenAddReservationDialog = () => {
        handleAddEventSidebarToggle()
        dispatch(handleSelectEvent(null))
    }

    return (
        <Drawer
            open={true}
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
                    width: 260,
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
            <Button variant='contained' onClick={handleOpenAddReservationDialog}>
                Adicionar Reserva
            </Button>

            <Typography variant='body2' sx={{ mt: 7, mb: 2, textTransform: 'uppercase' }}>
                {condominiumCommonAreaName}
            </Typography>
        </Drawer>
    )
}

export default SidebarLeft
