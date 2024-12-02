import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import ServiceDetails from './ServiceDetails'

import { CondominiumService } from 'src/services/condominiumService'

import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'

type NewServiceProps = {
    onCancel: () => void
    onConfirm: () => void
}

function NewService({ onCancel, onConfirm }: NewServiceProps) {
    return (
        <Dialog fullWidth maxWidth='sm' scroll='body' open onClose={onCancel}>
            <DialogTitle sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onCancel()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Adicionar Serviço
                    </Typography>
                    <Typography variant='body2'>Insira um serviço nesse condomínio.</Typography>
                </Box>
            </DialogTitle>

            <ServiceDetails
                disabledAllFields={false}
                onCancel={onCancel}
                onConfirm={onConfirm}
                serviceAction={(data: ServiceType) =>
                    CondominiumService.service.post(null, data).then(result => result.data as ServiceType)
                }
            />
        </Dialog>
    )
}

export default NewService
