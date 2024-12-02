import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Close from 'mdi-material-ui/Close'

type DialogProps = {
    onClose: () => void
    title: string
    description: string
    children: React.ReactNode
}
export default function DialogComponent({ onClose, title, description, children }: DialogProps) {
    return (
        <Dialog fullWidth maxWidth='md' scroll='body' open>
            <DialogTitle sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onClose()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        {title}
                    </Typography>
                    <Typography variant='body2'>{description}</Typography>
                </Box>
            </DialogTitle>
            <Box marginX='72px' marginBottom='36px'>
                {children}
            </Box>
        </Dialog>
    )
}
