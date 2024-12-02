import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Close from '@mui/icons-material/Close'

import ServiceDetails from './ServiceDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'

type ViewSupplierProps = {
    onCancel: () => void
    serviceId: string
}

function ViewSupplier({ onCancel, serviceId }: ViewSupplierProps) {
    const queryClient = useQueryClient()
    const serviceQuery = useQuery({
        queryKey: ['services'],
        queryFn: () => CondominiumService.service.get().then(response => response.data),
        select: response => response.results.find((service: ServiceType) => service.id === serviceId),
        initialData: queryClient.getQueryState<{ results: ServiceType[] }>(['services'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const service = serviceQuery.data

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
                        Visualizar Serviço
                    </Typography>
                    <Typography variant='body2'>Visualize as informações de um serviço desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <ServiceDetails
                onCancel={onCancel}
                key={service?.id || 'loading'}
                disabledAllFields={true}
                service={service}
            />
        </Dialog>
    )
}

export default ViewSupplier
