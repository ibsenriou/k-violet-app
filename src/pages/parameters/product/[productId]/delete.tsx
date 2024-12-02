import { useRouter } from 'next/router'
import DeleteProduct from 'src/views/pages/parameters/product/DeleteProduct'
import ProductLayout from '../layout'

function DeleteProductPage() {
    const router = useRouter()
    const { productId } = router.query

    return (
        <DeleteProduct
            onCancel={() => router.push('/parameters/product')}
            onConfirm={() => router.push('/parameters/product')}
            productId={productId as string}
        />
    )
}

export default DeleteProductPage

DeleteProductPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

DeleteProductPage.appendLayout = true
