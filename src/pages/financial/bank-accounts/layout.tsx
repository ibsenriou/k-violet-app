import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import BankAccountList from 'src/views/pages/financial/bank-account/BankAccountList'

export default function BankAccountLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <BankAccountList
                onViewBankAccount={row => router.push(`/financial/bank-accounts/${row.id}/view`)}
                onDeleteBankAccount={row => router.push(`/financial/bank-accounts/${row.id}/delete`)}
                onNewBankAccount={() => router.push('/financial/bank-accounts/new')}
            />
            {children}
        </Card>
    )
}
