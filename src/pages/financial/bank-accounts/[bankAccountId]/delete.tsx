import { useRouter } from 'next/router'
import DeleteBankAccount from 'src/views/pages/financial/bank-account/DeleteBankAccount'
import BankAccountLayout from '../layout'

function DeleteBankAccountPage() {
    const router = useRouter()
    const { bankAccountId } = router.query

    return (
        <DeleteBankAccount
            onCancel={() => router.push('/financial/bank-accounts')}
            onConfirm={() => router.push('/financial/bank-accounts')}
            bankAccountId={bankAccountId as string}
        />
    )
}

export default DeleteBankAccountPage

DeleteBankAccountPage.getLayout = function getLayout(page: React.ReactNode) {
    return <BankAccountLayout>{page}</BankAccountLayout>
}

DeleteBankAccountPage.appendLayout = true

