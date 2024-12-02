import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import ServiceList from 'src/views/pages/parameters/service/ServiceList'

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <ServiceList
                onViewService={row => router.push(`/parameters/service/${row.id}/view`)}
                onDeleteService={row => router.push(`/parameters/service/${row.id}/delete`)}
                onEditService={row => router.push(`/parameters/service/${row.id}/edit`)}
                onNewService={() => router.push('/parameters/service/new')}
            />
            {children}
        </Card>
    )
}