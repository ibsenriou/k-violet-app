import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import ProductDetails from './ProductDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'

type ViewProductProps = {
    onCancel: () => void
    productId: string
}

function ViewProduct({ onCancel, productId }: ViewProductProps) {
    const queryClient = useQueryClient()
    const productQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => CondominiumService.product.get().then(response => response.data),
        select: response => response.results.find((product: ProductType) => product.id === productId),
        initialData: queryClient.getQueryState<{ results: ProductType[] }>(['products'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const product = productQuery.data

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
                        Visualizar Produto
                    </Typography>
                    <Typography variant='body2'>Visualize as informações de um produto desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <ProductDetails
                onCancel={onCancel}
                key={product?.id || 'loading'}
                disabledAllFields={true}
                product={product}
            />
        </Dialog>
    )
}

export default ViewProduct
