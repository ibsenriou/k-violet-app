import { useRouter } from 'next/router'
import ServiceLayout from '../layout'
import EditService from 'src/views/pages/parameters/service/EditService'

function EditServicePage() {
    const router = useRouter()
    const { serviceId } = router.query

    return (
        <EditService
            onCancel={() => router.push('/parameters/service')}
            onConfirm={() => router.push('/parameters/service')}
            serviceId={serviceId as string}
        />
    )
}

export default EditServicePage

EditServicePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ServiceLayout>{page}</ServiceLayout>
}

EditServicePage.appendLayout = true
EditServicePage.acl = {
    action: 'update',
    subject: 'parameters-service-page--details-edit'
}
