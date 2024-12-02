import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import ReadingItemList from 'src/views/pages/parameters/reading-item/ReadingItemList'

export default function ReadingItemLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <ReadingItemList
                onViewReadingItem={row => router.push(`/parameters/reading-item/${row.id}/view`)}
                onDeleteReadingItem={row => router.push(`/parameters/reading-item/${row.id}/delete`)}
                onEditReadingItem={row => router.push(`/parameters/reading-item/${row.id}/edit`)}
                onNewReadingItem={() => router.push('/parameters/reading-item/new')}
            />
            {children}
        </Card>
    )
}
