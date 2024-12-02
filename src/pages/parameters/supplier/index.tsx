import SupplierLayout from './layout'

export default function Supplier() {
    return null
}

Supplier.getLayout = function getLayout(page: React.ReactNode) {
    return <SupplierLayout>{page}</SupplierLayout>
}

Supplier.appendLayout = true
