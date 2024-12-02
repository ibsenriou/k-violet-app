import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import ChargeList from 'src/views/pages/financial/charges/ChargeList'

export default function ChargeLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <ChargeList
                onNewCharge={() => router.push('/financial/charges/new')}
                onViewCharge={chargeId => router.push(`/financial/charges/${chargeId}/view`)}
                onDeleteCharge={chargeId => router.push(`/financial/charges/${chargeId}/delete`)}
            />
            {children}
        </Card>
    )
}
