import UserRoleLayout from './layout'

export default function UserRoleList() {
    return null
}

UserRoleList.getLayout = function getLayout(page: React.ReactNode) {
    return <UserRoleLayout>{page}</UserRoleLayout>
}

UserRoleList.appendLayout = true
