import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'
import AssetDetails from './AssetDetails'

type DeleteAssetItemProps = {
    onCancel: () => void
    onConfirm: () => void
    assetId: string
}

function DeleteAsset({ onCancel, onConfirm, assetId }: DeleteAssetItemProps) {
    const queryClient = useQueryClient()
    const AssetQuery = useQuery({
        queryKey: ['asset', assetId],
        queryFn: () => CondominiumService.asset.get().then(response => response.data),
        select: response => response.results.find((service: AssetType) => service.id === assetId),
        initialData: queryClient.getQueryState<{ results: AssetType[] }>(['asset'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const asset = AssetQuery.data

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
                        Remover Ativo de Condomínio
                    </Typography>
                    <Typography variant='body2'>Remova um ativo de condomínio desse condomínio.</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Esta ação irá excluir permanentemente o ativo de condomínio. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                    </Alert>
                </Box>
            </DialogTitle>
            <AssetDetails
                key={asset?.id || 'loading'}
                onConfirmLabel='Excluir'
                onConfirmColor='error'
                onCancel={onCancel}
                onConfirm={onConfirm}
                disabledAllFields={true}
                asset={asset}
                serviceAction={() => CondominiumService.assetId.delete({ assetId }).then(response => response.data)}
            />
        </Dialog>
    )
}

export default DeleteAsset