import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import { CondominiumService } from 'src/services/condominiumService'

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'
import AssetDetails from './AssetDetails'

type NewAssetProps = {
    onCancel: () => void
    onConfirm: () => void
}

function NewAsset({ onCancel, onConfirm }: NewAssetProps) {
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
                        Adicionar Ativo de Condomínio
                    </Typography>
                    <Typography variant='body2'>Insira um ativo nesse condomínio.</Typography>
                </Box>
            </DialogTitle>

            <AssetDetails
                disabledAllFields={false}
                onCancel={onCancel}
                onConfirm={onConfirm}
                serviceAction={(data: AssetType) =>
                    CondominiumService.asset.post(null, data).then(result => result.data as AssetType)
                }
            />
        </Dialog>
    )
}

export default NewAsset
