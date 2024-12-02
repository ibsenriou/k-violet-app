import AddPermission from 'src/views/pages/admin/access-control/AddPermission'
import EditRolePage from '.'
import { useRouter } from 'next/router'

export default function AddPermissionPage() {
    const router = useRouter()
    const { roleId } = router.query

    if (typeof roleId !== 'string') {
        return null
    }

    return (
        <AddPermission
            roleId={roleId}
            onCancel={() => router.push(`/admin/access-control/role/${roleId}`)}
            onConfirm={() => router.push(`/admin/access-control/role/${roleId}`)}
        />
    )
}

AddPermissionPage.appendLayout = true
AddPermissionPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <>
            <EditRolePage />
            {page}
        </>
    )
}
