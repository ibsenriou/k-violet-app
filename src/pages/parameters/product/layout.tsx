import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import ProductList from 'src/views/pages/parameters/product/ProductList'

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <ProductList
                onViewProduct={row => router.push(`/parameters/product/${row.id}/view`)}
                onDeleteProduct={row => router.push(`/parameters/product/${row.id}/delete`)}
                onEditProduct={row => router.push(`/parameters/product/${row.id}/edit`)}
                onNewProduct={() => router.push('/parameters/product/new')}
            />
            {children}
        </Card>
    )
}