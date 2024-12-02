import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import SupplierDetails from './SupplierDetails'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { CondominiumService } from 'src/services/condominiumService'

type DeleteSupplierProps = {
    onCancel: () => void
    onConfirm: () => void
    supplierId: string
}

function DeleteSupplier({ onCancel, onConfirm, supplierId }: DeleteSupplierProps) {
    const queryClient = useQueryClient()
    const supplierQuery = useQuery({
        queryKey: ['supplier'],
        queryFn: () => CondominiumService.suppliers.get().then(response => response.data),
        select: response => response.results.find((supplier: SupplierType) => supplier.id === supplierId),
        initialData: queryClient.getQueryState<{ results: SupplierType[] }>(['supplier'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const supplier = supplierQuery.data

    return (
        <Dialog fullWidth maxWidth='md' scroll='body' open onClose={onCancel}>
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
                        Remover Fornecedor
                    </Typography>
                    <Typography variant='body2'>Remova o fornecedor desse condomínio.</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Esta ação irá excluir permanentemente o fornecedor. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                    </Alert>
                </Box>
            </DialogTitle>
            <SupplierDetails
                key={supplier?.id || 'loading'}
                onConfirmLabel='Excluir'
                onConfirmColor='error'
                onCancel={onCancel}
                onConfirm={onConfirm}
                disabledAllFields={true}
                supplier={supplier}
                serviceAction={() =>
                    CondominiumService.supplierId.delete({ supplierId }).then(response => response.data)
                }
            />
        </Dialog>
    )
}

export default DeleteSupplier
