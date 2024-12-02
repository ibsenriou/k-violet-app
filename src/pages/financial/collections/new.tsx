import { useRouter } from 'next/router'
import CollectionLayout from './layout'
import NewCollection from 'src/views/pages/financial/collection/NewCollection'

function NewCollectionPage() {
    const router = useRouter()

    return (
        <NewCollection
            onCancel={() => router.push('/financial/collections')}
            onConfirm={() => router.push('/financial/collections')}
        />
    )
}

NewCollectionPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <CollectionLayout>{page}</CollectionLayout>
    )
}

NewCollectionPage.appendLayout = true


export default NewCollectionPage
