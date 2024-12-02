import { useRouter } from 'next/router'
import ServiceLayout from '../layout'
import ViewService from 'src/views/pages/parameters/service/ViewService'

function ViewServicePage() {
    const router = useRouter()
    const { serviceId } = router.query

    return <ViewService onCancel={() => router.push('/parameters/service')} serviceId={serviceId as string} />
}

export default ViewServicePage

ViewServicePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ServiceLayout>{page}</ServiceLayout>
}

ViewServicePage.appendLayout = true
