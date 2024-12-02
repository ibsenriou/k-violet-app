import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Close from '@mui/icons-material/Close'

import ServiceDetails from './ServiceDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'

import { CondominiumService } from 'src/services/condominiumService'

type DeleteServiceProps = {
    onCancel: () => void
    onConfirm: () => void
    serviceId: string
}

function DeleteService({ onCancel, onConfirm, serviceId }: DeleteServiceProps) {
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
                        Remover Serviço
                    </Typography>
                    <Typography variant='body2'>Remova o serviço desse condomínio.</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Esta ação irá excluir permanentemente o serviço. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                    </Alert>
                </Box>
            </DialogTitle>
            <ServiceDetails
                key={service?.id || 'loading'}
                onConfirmLabel='Excluir'
                onConfirmColor='error'
                onCancel={onCancel}
                onConfirm={onConfirm}
                disabledAllFields={true}
                service={service}
                serviceAction={() => CondominiumService.serviceId.delete({ serviceId }).then(response => response.data)}
            />
        </Dialog>
    )
}

export default DeleteService
