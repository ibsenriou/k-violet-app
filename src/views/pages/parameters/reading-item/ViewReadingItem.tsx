import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import ReadingItemDetails from './ReadingItemDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { ReadingItemType } from '@typesApiMapping/apps/condominium/ReadingItemTypes'

type ViewReadingItemProps = {
    onCancel: () => void
    reading_itemId: string
}

function ViewReadingItem({ onCancel, reading_itemId: reading_itemId }: ViewReadingItemProps) {
    const queryClient = useQueryClient()
    const readingItemQuery = useQuery({
        queryKey: ['reading_itemId'],
        queryFn: () => CondominiumService.reading_item.get().then(response => response.data),
        select: response =>
            response.results.find((reading_item: ReadingItemType) => reading_item.id === reading_itemId),
        initialData: queryClient.getQueryState<{ results: ReadingItemType[] }>(['reading_itemId'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const readingItem = readingItemQuery.data

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
                        Visualizar Item de Leitura
                    </Typography>
                    <Typography variant='body2'>
                        Visualize as informações de um item de leitura desse condomínio.
                    </Typography>
                </Box>
            </DialogTitle>
            <ReadingItemDetails
                onCancel={onCancel}
                key={readingItem?.id || 'loading'}
                disabledAllFields={true}
                readingItem={readingItem}
            />
        </Dialog>
    )
}

export default ViewReadingItem
