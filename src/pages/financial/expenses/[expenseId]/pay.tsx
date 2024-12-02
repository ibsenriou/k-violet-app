import { useRouter } from 'next/router'


import ExpensesLayout from '../layout'
import PayExpense from 'src/views/pages/financial/expenses/PayExpense'

function PayExpensePage() {
  const router = useRouter()

  return (
    <PayExpense
      onCancel={() => router.push('/financial/expenses')}
      onConfirm={() => router.push('/financial/expenses')}
    />
  )
}

PayExpensePage.getLayout = function getLayout(page: React.ReactNode) {
  return <ExpensesLayout>{page}</ExpensesLayout>
}

PayExpensePage.appendLayout = true
PayExpensePage.acl = {
  action: 'create',
  subject: 'financial-expenses-page--details-pay'
}

export default PayExpensePage
