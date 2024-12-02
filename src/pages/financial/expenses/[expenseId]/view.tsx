import { useRouter } from 'next/router'
import ExpensesLayout from '../layout'
import ViewExpense from 'src/views/pages/financial/expenses/ViewExpense'


function ExpensePage() {
    const router = useRouter()
    const { expenseId } = router.query

    return (
        <ViewExpense onClose={() => router.push('/financial/expenses')} expenseId={expenseId as string} />
    )
}

export default ExpensePage

ExpensePage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <ExpensesLayout>
            {page}
        </ExpensesLayout>
    )
}

ExpensePage.appendLayout = true
