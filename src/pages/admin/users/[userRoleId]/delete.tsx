import { useRouter } from 'next/router'
import ProductLayout from '../layout'
import DeleteUserRole from 'src/views/pages/admin/users/DeleteUserRole'

function DeleteUserRolePage() {
    const router = useRouter()
    const { userRoleId } = router.query

    return (
        <DeleteUserRole
            onCancel={() => router.push('/admin/users')}
            onConfirm={() => router.push('/admin/users')}
            userRoleId={userRoleId as string}
        />
    )
}

export default DeleteUserRolePage

DeleteUserRolePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

DeleteUserRolePage.appendLayout = true
