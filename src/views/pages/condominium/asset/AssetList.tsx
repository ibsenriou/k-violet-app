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

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'
import { assert } from 'console'

type AssetListProps = {
    onViewAsset: (row: AssetType) => void
    onEditAsset: (row: AssetType) => void
    onDeleteAsset: (row: AssetType) => void
    onNewAsset: () => void
}

export default function AssetList({ onViewAsset, onDeleteAsset, onNewAsset, onEditAsset }: AssetListProps) {
    const AssetQuery = useQuery({
        queryKey: ['asset'],
        queryFn: () => CondominiumService.asset.get().then(response => response.data),
        select: response => response.results
    })

    const AssetList = AssetQuery.data
    return (
        <Table
            searchField={['name']}
            topRightActionCallback={onNewAsset}
            topRightActionLabel='Adicionar  Ativo'
            title='Buscar Ativo'
            data={AssetList ?? []}
        >
            <TableCell align='left' header='Categoria' field='lookup_type_of_asset_category' />

            <TableCell align='left' header='nome' field='name' />

            <TableCell align='left' header='descrição' field='description' />

            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewAsset(row as AssetType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onEditAsset(row as AssetType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteAsset(row as AssetType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
