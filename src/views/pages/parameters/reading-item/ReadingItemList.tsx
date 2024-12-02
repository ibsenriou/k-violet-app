import { useQuery } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import { CondominiumService } from 'src/services/condominiumService'

import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'

import { ReadingItemType } from '@typesApiMapping/apps/condominium/ReadingItemTypes'

type ReadingItemListProps = {
    onViewReadingItem: (row: ReadingItemType) => void
    onEditReadingItem: (row: ReadingItemType) => void
    onDeleteReadingItem: (row: ReadingItemType) => void
    onNewReadingItem: () => void
}

export default function ReadingItemList({
    onViewReadingItem,
    onDeleteReadingItem,
    onNewReadingItem,
    onEditReadingItem
}: ReadingItemListProps) {
    const ReadingItemQuery = useQuery({
        queryKey: ['reading_item'],
        queryFn: () => CondominiumService.reading_item.get().then(response => response.data),
        select: response => response.results
    })

    const ReadingItemList = ReadingItemQuery.data
    return (
        <Table
            searchField={['description']}
            topRightActionCallback={onNewReadingItem}
            topRightActionLabel='Adicionar Item de Leitura'
            title='Buscar Item de Leitura'
            data={ReadingItemList ?? []}
        >
            <TableCell
                align='left'
                header='Nome'
                field='description'
                format={v =>
                    v
                        .replace('Despesas C/ Energia', '')
                        .replace('Despesas C/ Água', '')
                        .replace('Despesas C/', '')
                        .trim()
                }
            />
            <TableCell align='left' header='Unidade de Medida' field='measurement_unit_character_abbreviation' />

            <TableCell align='left' header='Preço' field='amount' />

            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewReadingItem(row as ReadingItemType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onEditReadingItem(row as ReadingItemType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteReadingItem(row as ReadingItemType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
