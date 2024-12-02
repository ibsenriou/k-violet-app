import { useRouter } from 'next/router'
import DeleteReadingItem from 'src/views/pages/parameters/reading-item/DeleteReadingItem'
import ReadingItemLayout from '../layout'

function DeleteReadingItemPage() {
    const router = useRouter()
    const { reading_itemId } = router.query

    return (
        <DeleteReadingItem
            onCancel={() => router.push('/parameters/reading-item')}
            onConfirm={() => router.push('/parameters/reading-item')}
            reading_itemId={reading_itemId as string}
        />
    )
}

export default DeleteReadingItemPage

DeleteReadingItemPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <ReadingItemLayout>{page}</ReadingItemLayout>
    )
}

DeleteReadingItemPage.appendLayout = true
