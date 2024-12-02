import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import CollectionList from 'src/views/pages/financial/collection/CollectionList'

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <CollectionList
                onNewCollection={() => router.push('/financial/collections/new')}
                onViewCollection={collectionId => router.push(`/financial/collections/${collectionId}/view`)}
                onDeleteCollection={collectionId => router.push(`/financial/collections/${collectionId}/delete`)}
            />
            {children}
        </Card>
    )
}
