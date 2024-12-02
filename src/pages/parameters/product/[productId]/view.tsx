import { useRouter } from 'next/router'
import ViewProduct from 'src/views/pages/parameters/product/ViewProduct'
import ProductLayout from '../layout'

function ViewProductPage() {
    const router = useRouter()
    const { productId } = router.query

    return <ViewProduct onCancel={() => router.push('/parameters/product')} productId={productId as string} />
}

export default ViewProductPage

ViewProductPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

ViewProductPage.appendLayout = true

