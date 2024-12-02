import ReadingItemLayout from './layout'

export default function ReadingItemList() {
    return null
}

ReadingItemList.getLayout = function getLayout(page: React.ReactNode) {
    return <ReadingItemLayout>{page}</ReadingItemLayout>
}

ReadingItemList.appendLayout = true
