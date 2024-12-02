import ViewSupplier from 'src/views/pages/parameters/supplier/ViewSupplier'
import { useRouter } from 'next/router'
import SupplierLayout from '../layout'

function ViewSupplierPage() {
    const router = useRouter()
    const { supplierId } = router.query

    return <ViewSupplier onCancel={() => router.push('/parameters/supplier')} supplierId={supplierId as string} />
}

export default ViewSupplierPage

ViewSupplierPage.getLayout = function getLayout(page: React.ReactNode) {
    return <SupplierLayout>{page}</SupplierLayout>
}

ViewSupplierPage.appendLayout = true
