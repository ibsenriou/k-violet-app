import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import ReadingItemDetails from './ReadingItemDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { ReadingItemType } from '@typesApiMapping/apps/condominium/ReadingItemTypes'

type DeleteReadingItemProps = {
    onCancel: () => void
    onConfirm: () => void
    reading_itemId: string
}

function DeleteReadingItem({ onCancel, onConfirm, reading_itemId }: DeleteReadingItemProps) {
    const queryClient = useQueryClient()
    const ReadingItemQuery = useQuery({
        queryKey: ['reading_itemId'],
        queryFn: () => CondominiumService.reading_item.get().then(response => response.data),
        select: response => response.results.find((service: ReadingItemType) => service.id === reading_itemId),
        initialData: queryClient.getQueryState<{ results: ReadingItemType[] }>(['reading_item'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const reading_item = ReadingItemQuery.data

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
                        Remover Item de Leitura
                    </Typography>
                    <Typography variant='body2'>Remova um item de leitura desse condomínio.</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Esta ação irá excluir permanentemente o item de leitura. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                    </Alert>
                </Box>
            </DialogTitle>
            <ReadingItemDetails
                key={reading_item?.id || 'loading'}
                onConfirmLabel='Excluir'
                onConfirmColor='error'
                onCancel={onCancel}
                onConfirm={onConfirm}
                disabledAllFields={true}
                readingItem={reading_item}
                serviceAction={() =>
                    CondominiumService.reading_itemId.delete({ reading_itemId }).then(response => response.data)
                }
            />
        </Dialog>
    )
}

export default DeleteReadingItem
