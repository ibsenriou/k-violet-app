import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'
import AssetDetails from './AssetDetails'

type EditAssetProps = {
    onCancel: () => void
    onConfirm: () => void
    assetId: string
}

function EditAsset({ onCancel, onConfirm, assetId: assetId }: EditAssetProps) {
    const queryClient = useQueryClient()
    const AssetQuery = useQuery({
        queryKey: ['asset', assetId],
        queryFn: () => CondominiumService.asset.get().then(response => response.data),
        select: response => response.results.find((service: AssetType) => service.id === assetId),
        initialData: queryClient.getQueryState<{ results: AssetType[] }>(['asset'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const AssetList = AssetQuery.data

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
                        Atualizar Ativo de Condomínio
                    </Typography>
                    <Typography variant='body2'>Atualize o ativo desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <AssetDetails
                key={AssetList?.id || 'loading'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                asset={AssetList}
                serviceAction={(data: AssetType) =>
                    CondominiumService.assetId.put({ assetId: assetId }, data).then(response => response.data)
                }
            />
        </Dialog>
    )
}

export default EditAsset
