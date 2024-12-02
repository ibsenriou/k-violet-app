import { useRouter } from 'next/router'
import ServiceLayout from './layout'
import NewService from 'src/views/pages/parameters/service/NewService'

function NewServicePage() {
    const router = useRouter()

    return (
        <NewService
            onCancel={() => router.push('/parameters/service')}
            onConfirm={() => router.push('/parameters/service')}
        />
    )
}

NewServicePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ServiceLayout>{page}</ServiceLayout>
}

NewServicePage.appendLayout = true

export default NewServicePage
