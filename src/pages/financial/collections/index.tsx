import CollectionLayout from './layout'

export default function CollectionList() {
    return null
}

CollectionList.getLayout = function getLayout(page: React.ReactNode) {
    return <CollectionLayout>{page}</CollectionLayout>
}

CollectionList.appendLayout = true
