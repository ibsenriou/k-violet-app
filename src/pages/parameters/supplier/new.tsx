import NewSupplier from 'src/views/pages/parameters/supplier/NewSupplier'
import { useRouter } from 'next/router'
import SupplierLayout from './layout'

function NewSupplierPage() {
    const router = useRouter()

    return (
        <NewSupplier
            onCancel={() => router.push('/parameters/supplier')}
            onConfirm={() => router.push('/parameters/supplier')}
        />
    )
}

NewSupplierPage.getLayout = function getLayout(page: React.ReactNode) {
    return <SupplierLayout>{page}</SupplierLayout>
}

NewSupplierPage.appendLayout = true

export default NewSupplierPage
