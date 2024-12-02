import { useRouter } from 'next/router'
import ProductLayout from '../layout'
import EditReadingItem from 'src/views/pages/parameters/reading-item/EditReadingItem'

function EditReadingItemPage() {
    const router = useRouter()
    const { reading_itemId: reading_itemId } = router.query

    return (
        <EditReadingItem
            onCancel={() => router.push('/parameters/reading-item')}
            onConfirm={() => router.push('/parameters/reading-item')}
            reading_itemId={reading_itemId as string}
        />
    )
}

export default EditReadingItemPage

EditReadingItemPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

EditReadingItemPage.appendLayout = true
