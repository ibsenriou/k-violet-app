import { useRouter } from 'next/router'
import NewRole from 'src/views/pages/admin/access-control/NewRole'
import AccessControlLayout from '../layout'

export default function NewRolePage() {
    const router = useRouter()

    return (
        <NewRole
            onCancel={() => router.push('/admin/access-control')}
            onConfirm={role => router.push('/admin/access-control/role/' + role.id)}
        />
    )
}

NewRolePage.appendLayout = true
NewRolePage.getLayout = function getLayout(page: React.ReactNode) {
    return <AccessControlLayout>{page}</AccessControlLayout>
}
