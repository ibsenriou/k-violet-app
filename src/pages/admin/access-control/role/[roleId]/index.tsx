import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import EditRole from 'src/views/pages/admin/access-control/EditRole'

export default function EditRolePage() {
    const router = useRouter()
    const { roleId } = router.query

    if (typeof roleId !== 'string') {
        return null
    }

    return (
        <Card>
            <EditRole
                roleId={roleId}
                onAddPermission={() => router.push(`/admin/access-control/role/${roleId}/add-permission`)}
            />
        </Card>
    )
}
