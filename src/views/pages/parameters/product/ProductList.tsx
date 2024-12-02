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

import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'

type ProductListProps = {
    onViewProduct: (row: ProductType) => void
    onEditProduct: (row: ProductType) => void
    onDeleteProduct: (row: ProductType) => void
    onNewProduct: () => void
}

export default function ProductList({ onViewProduct, onDeleteProduct, onNewProduct, onEditProduct }: ProductListProps) {
    const productQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => CondominiumService.product.get().then(response => response.data),
        select: response => response.results
    })

    const productList = productQuery.data

    return (
        <Table
            searchField={['name', 'description', 'account_description']}
            topRightActionCallback={onNewProduct}
            topRightActionLabel='Adicionar Produto'
            title='Buscar Produto'
            data={productList ?? []}
        >
            <TableCell align='left' header='Nome' field='name' />
            <TableCell align='left' header='Unidade de Medida' field='measurement_unit_description' />
            <TableCell
                align='left'
                header='Categoria'
                field='account_description'
                format={v =>
                    v
                        ?.replace('Despesas C/ Materiais de', '')
                        .replace('Despesas C/ Materiais', '')
                        .replace('Despesas C/', '')
                        .trim()
                }
            />
            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewProduct(row as ProductType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onEditProduct(row as ProductType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton>
                        <IconButton onClick={() => onDeleteProduct(row as ProductType)}>
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
