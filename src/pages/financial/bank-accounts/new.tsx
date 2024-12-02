import { useRouter } from "next/router"
import NewBankAccount from "src/views/pages/financial/bank-account/NewBankAccount"
import BankAccountLayout from "./layout"

function NewBankAccountPage() {
  const router = useRouter()

  return (
    <NewBankAccount
      onCancel={() => router.push('/financial/bank-accounts')}
      onConfirm={() => router.push('/financial/bank-accounts')}
    />
  )
}

NewBankAccountPage.getLayout = function getLayout(page: React.ReactNode) {
  return <BankAccountLayout>{page}</BankAccountLayout>
}

NewBankAccountPage.appendLayout = true

export default NewBankAccountPage
