import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import ProductDetails from './ProductDetails'

import { CondominiumService } from 'src/services/condominiumService'

import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'

type NewProductProps = {
    onCancel: () => void
    onConfirm: () => void
}

function NewProduct({ onCancel, onConfirm }: NewProductProps) {
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
                        Adicionar Produto
                    </Typography>
                    <Typography variant='body2'>Insira um produto nesse condomínio.</Typography>
                </Box>
            </DialogTitle>

            <ProductDetails
                disabledAllFields={false}
                onCancel={onCancel}
                onConfirm={onConfirm}
                serviceAction={(data: ProductType) =>
                    CondominiumService.product.post(null, data).then(result => result.data as ProductType)
                }
            />
        </Dialog>
    )
}

export default NewProduct
