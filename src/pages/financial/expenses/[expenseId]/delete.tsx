import { useRouter } from 'next/router'

import DeleteExpense from 'src/views/pages/financial/expenses/DeleteExpense'
import ExpensesLayout from '../layout'

function DeleteExpensePage() {
    const router = useRouter()
    const { expenseId } = router.query

    return (
        <DeleteExpense onClose={() => router.push('/financial/expenses')} expenseId={expenseId as string} />
    )
}

export default DeleteExpensePage

DeleteExpensePage.getLayout = function getLayout(page: React.ReactNode) {
    return <ExpensesLayout>{page}</ExpensesLayout>
}

DeleteExpensePage.appendLayout = true
DeleteExpensePage.acl = {
    action: 'delete',
    subject: 'financial-collection-page--details'
}
