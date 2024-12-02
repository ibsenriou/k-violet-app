// import { useRouter } from 'next/router'

import BankAccountLayout from '../layout'

// import EditBankAccount from 'src/views/pages/financial/bank-account/EditBankAccount'

function EditBankAccountPage() {
    // const router = useRouter()
    // const { bankAccountId } = router.query

    // ** This function is not implemented yet. But most likely it will be required in the future. For now we are only returning an empty page.

    return null

    // return (
    //     <EditBankAccount
    //         onCancel={() => router.push('/financial/bank-accounts')}
    //         onConfirm={() => router.push('/financial/bank-accounts')}
    //         bankAccountId={bankAccountId as string}
    //     />
    // )
}

export default EditBankAccountPage

EditBankAccountPage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <BankAccountLayout>{page}</BankAccountLayout>
    )
}

EditBankAccountPage.appendLayout = true
