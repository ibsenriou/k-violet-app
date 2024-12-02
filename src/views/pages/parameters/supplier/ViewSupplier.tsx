import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Close from '@mui/icons-material/Close'

import SupplierDetails from './SupplierDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { CondominiumService } from 'src/services/condominiumService'

type ViewSupplierProps = {
    onCancel: () => void
    supplierId: string
}

function ViewSupplier({ onCancel, supplierId }: ViewSupplierProps) {
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
                        Visualizar Fornecedor
                    </Typography>
                    <Typography variant='body2'>
                        Visualize as informações de um o fornecedor desse condomínio.
                    </Typography>
                </Box>
            </DialogTitle>
            <SupplierDetails
                onCancel={onCancel}
                key={supplier?.id || 'loading'}
                disabledAllFields={true}
                supplier={supplier}
            />
        </Dialog>
    )
}

export default ViewSupplier