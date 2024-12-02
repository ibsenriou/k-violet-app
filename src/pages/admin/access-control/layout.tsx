import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import RoleList from 'src/views/pages/admin/access-control/RoleList'

export default function AccessControlLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <RoleList
                onViewRole={role => router.push(`/admin/access-control/role/${role.id}`)}
                onEditRole={role => router.push(`/admin/access-control/role/${role.id}/edit`)}
                onDeleteRole={role => router.push(`/admin/access-control/role/${role.id}/delete`)}
                onNewRole={() => router.push('/admin/access-control/role/new')}
            />
            {children}
        </Card>
    )
}
