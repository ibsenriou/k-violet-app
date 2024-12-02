import { useRouter } from 'next/router'
import NewUserRole from 'src/views/pages/admin/users/NewUserRole'
import UserRoleLayout from './layout'

function NewUserRolePage() {
    const router = useRouter()

    return (
        <NewUserRole
            onCancel={() => router.push('/admin/users')}
            onConfirm={() => router.push('/admin/users')}
        />
    )
}

NewUserRolePage.getLayout = function getLayout(page: React.ReactNode) {
    return <UserRoleLayout>{page}</UserRoleLayout>
}

NewUserRolePage.appendLayout = true

export default NewUserRolePage
