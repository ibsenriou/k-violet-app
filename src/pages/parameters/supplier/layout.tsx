import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import SupplierList from 'src/views/pages/parameters/supplier/SupplierList'

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <SupplierList
                onViewSupplier={row => router.push(`/parameters/supplier/${row.id}/view`)}
                onDeleteSupplier={row => router.push(`/parameters/supplier/${row.id}/delete`)}
                onNewSupplier={() => router.push('/parameters/supplier/new')}
            />
            {children}
        </Card>
    )
}