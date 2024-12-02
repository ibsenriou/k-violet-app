import { useRouter } from 'next/router'
import EditProduct from 'src/views/pages/parameters/product/EditProduct'
import ProductLayout from '../layout'

function EditProductPage() {
    const router = useRouter()
    const { productId } = router.query

    return (
        <EditProduct
            onCancel={() => router.push('/parameters/product')}
            onConfirm={() => router.push('/parameters/product')}
            productId={productId as string}
        />
    )
}

export default EditProductPage

EditProductPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

EditProductPage.appendLayout = true
