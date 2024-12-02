import DeleteSupplier from 'src/views/pages/parameters/supplier/DeleteSupplier'
import { useRouter } from 'next/router'
import SupplierLayout from '../layout'

function DeleteSupplierPage() {
    const router = useRouter()
    const { supplierId } = router.query

    return (
        <DeleteSupplier
            onCancel={() => router.push('/parameters/supplier')}
            onConfirm={() => router.push('/parameters/supplier')}
            supplierId={supplierId as string}
        />
    )
}

export default DeleteSupplierPage

DeleteSupplierPage.getLayout = function getLayout(page: React.ReactNode) {
    return <SupplierLayout>{page}</SupplierLayout>
}

DeleteSupplierPage.appendLayout = true
