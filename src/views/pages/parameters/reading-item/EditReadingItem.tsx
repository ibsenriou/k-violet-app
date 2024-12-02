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

type EditReadingItemProps = {
    onCancel: () => void
    onConfirm: () => void
    reading_itemId: string
}

function EditReadingItem({ onCancel, onConfirm, reading_itemId: reading_itemId }: EditReadingItemProps) {
    const queryClient = useQueryClient()
    const ReadingItemQuery = useQuery({
        queryKey: ['reading_item'],
        queryFn: () => CondominiumService.reading_item.get().then(response => response.data),
        select: response => response.results.find((service: ReadingItemType) => service.id === reading_itemId),
        initialData: queryClient.getQueryState<{ results: ReadingItemType[] }>(['reading_item'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const ReadingItemList = ReadingItemQuery.data

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
                        Atualizar Item de Leitura
                    </Typography>
                    <Typography variant='body2'>Atualize o item de leitura desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <ReadingItemDetails
                key={ReadingItemList?.id || 'loading'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                readingItem={ReadingItemList}
                serviceAction={(data: ReadingItemType) =>
                    CondominiumService.reading_itemId
                        .put({ reading_itemId: reading_itemId }, data)
                        .then(response => response.data)
                }
            />
        </Dialog>
    )
}

export default EditReadingItem
