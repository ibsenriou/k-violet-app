import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import UserRoleList from 'src/views/pages/admin/users/UserRoleList'

export default function UserRoleLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <UserRoleList
                onDeleteUserRole={row => router.push(`/admin/users/${row.id}/delete`)}
                onNewUserRole={() => router.push('/admin/users/new')}
            />
            {children}
        </Card>
    )
}
