import { useRouter } from 'next/router'
import NewReadingItem from 'src/views/pages/parameters/reading-item/NewReadingItem'
import ReadingItemLayout from './layout'

function NewReadingItemPage() {
    const router = useRouter()

    return (
        <NewReadingItem
            onCancel={() => router.push('/parameters/reading-item')}
            onConfirm={() => router.push('/parameters/reading-item')}
        />
    )
}

NewReadingItemPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <ReadingItemLayout>
            {page}
        </ReadingItemLayout>
    )
}

NewReadingItemPage.appendLayout = true

export default NewReadingItemPage
