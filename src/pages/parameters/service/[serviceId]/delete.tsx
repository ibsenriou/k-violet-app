import { useRouter } from 'next/router'
import ServiceLayout from '../layout'
import DeleteService from 'src/views/pages/parameters/service/DeleteService'

function DeleteServicePage() {
    const router = useRouter()
    const { serviceId } = router.query

    return (
        <DeleteService
            onCancel={() => router.push('/parameters/service')}
            onConfirm={() => router.push('/parameters/service')}
            serviceId={serviceId as string}
        />
    )
}

export default DeleteServicePage

DeleteServicePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ServiceLayout>{page}</ServiceLayout>
}

DeleteServicePage.appendLayout = true

