import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import AssetDetails from './AssetDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'

type ViewAssetProps = {
    onCancel: () => void
    assetId: string
}

function ViewAsset({ onCancel, assetId: assetId }: ViewAssetProps) {
    const queryClient = useQueryClient()
    const assetQuery = useQuery({
        queryKey: ['asset', assetId],
        queryFn: () => CondominiumService.asset.get().then(response => response.data),
        select: response => response.results.find((asset: AssetType) => asset.id === assetId),
        initialData: queryClient.getQueryState<{ results: AssetType[] }>(['asset'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const asset = assetQuery.data

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
                        Visualizar Ativo
                    </Typography>
                    <Typography variant='body2'>Visualize as informações de um Ativo desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <AssetDetails onCancel={onCancel} key={asset?.id || 'loading'} disabledAllFields={true} asset={asset} />
        </Dialog>
    )
}

export default ViewAsset
