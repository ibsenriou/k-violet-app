import { useRouter } from 'next/router'
import ViewProduct from 'src/views/pages/parameters/reading-item/ViewReadingItem'
import ProductLayout from '../layout'

function ViewReadingItemPage() {
    const router = useRouter()
    const { reading_itemId: reading_itemId } = router.query

    return (
        <ViewProduct
            onCancel={() => router.push('/parameters/reading-item')}
            reading_itemId={reading_itemId as string}
        />
    )
}

export default ViewReadingItemPage

ViewReadingItemPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

ViewReadingItemPage.appendLayout = true
