import { useRouter } from 'next/router'
import ExpensesLayout from './layout'
import NewExpense from 'src/views/pages/financial/expenses/NewExpense'

function NewExpensesPage() {
  const router = useRouter()

  return (
    <NewExpense
      onCancel={() => router.push('/financial/expenses')}
      onConfirm={() => router.push('/financial/expenses')}
    />
  )
}

NewExpensesPage.getLayout = function getLayout(page: React.ReactNode) {
  return <ExpensesLayout>{page}</ExpensesLayout>
}

NewExpensesPage.appendLayout = true

export default NewExpensesPage
