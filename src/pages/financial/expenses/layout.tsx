import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import ExpenseList from 'src/views/pages/financial/expenses/ExpenseList'

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <ExpenseList
                onNewExpense={() => router.push('/financial/expenses/new')}
                onPayExpense={expenseId => router.push(`/financial/expenses/${expenseId}/pay`)}
                onViewExpense={expenseId => router.push(`/financial/expenses/${expenseId}/view`)}
                onDeleteExpense={expenseId => router.push(`/financial/expenses/${expenseId}/delete`)}
            />
            {children}
        </Card>
    )
}
