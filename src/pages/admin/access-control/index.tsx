import AccessControlLayout from './layout'

export default function AccessControlPage() {
    return null
}

AccessControlPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <AccessControlLayout>
            {page}
        </AccessControlLayout>
    )
}

AccessControlPage.appendLayout = true
