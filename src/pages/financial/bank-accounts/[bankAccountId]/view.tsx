import { useRouter } from 'next/router'
import ViewBankAccount from 'src/views/pages/financial/bank-account/ViewBankAccount'
import BankAccountLayout from '../layout'

function ViewBankAccountPage() {
    const router = useRouter()
    const { bankAccountId } = router.query

    return <ViewBankAccount
      onCancel={() => router.push('/financial/bank-accounts')}
      bankAccountId={bankAccountId as string} />
    }

export default ViewBankAccountPage

ViewBankAccountPage.getLayout = function getLayout(page: React.ReactNode) {
    return <BankAccountLayout>{page}</BankAccountLayout>
}

ViewBankAccountPage.appendLayout = true

