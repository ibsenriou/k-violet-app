import ExpensesLayout from './layout'

export default function ExpensesList() {
    return null
}

ExpensesList.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <ExpensesLayout>{page}</ExpensesLayout>
    )
}

ExpensesList.appendLayout = true
