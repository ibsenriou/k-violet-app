import { useRouter } from 'next/router'
import NewProduct from 'src/views/pages/parameters/product/NewProduct'
import ProductLayout from './layout'

function NewProductPage() {
    const router = useRouter()

    return (
        <NewProduct
            onCancel={() => router.push('/parameters/product')}
            onConfirm={() => router.push('/parameters/product')}
        />
    )
}

NewProductPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

NewProductPage.appendLayout = true
NewProductPage.acl = {
    action: 'create',
    subject: 'parameters-product-page--details-new'
}

export default NewProductPage
