import { useRouter } from 'next/router'
import DeleteCollection from 'src/views/pages/financial/collection/DeleteCollection'
import CollectionLayout from '../layout'

function CollectionPage() {
    const router = useRouter()
    const { collectionId } = router.query

    return (
        <DeleteCollection onClose={() => router.push('/financial/collections')} collectionId={collectionId as string} />
    )
}

export default CollectionPage

CollectionPage.getLayout = function getLayout(page: React.ReactNode) {
    return <CollectionLayout>{page}</CollectionLayout>
}

CollectionPage.appendLayout = true
