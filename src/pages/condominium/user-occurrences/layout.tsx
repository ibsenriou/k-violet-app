import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import UserOccurrencesList from 'src/views/pages/condominium/user-occurrences/UserOccurrencesList'

export default function UserOccurrencesLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <UserOccurrencesList
                onNewOccurrence={() => router.push('/condominium/user-occurrences/new')}
                onViewOccurrence={occurrenceId => router.push(`/condominium/user-occurrences/${occurrenceId}/view`)}
            />
            {children}
        </Card>
    )
}
