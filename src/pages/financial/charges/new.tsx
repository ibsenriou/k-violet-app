import { useRouter } from 'next/router'
import ChargeLayout from './layout'
import NewCharge from 'src/views/pages/financial/charges/NewCharge'

function NewChargePage() {
    const router = useRouter()

    return (
        <NewCharge
            onCancel={() => router.push('/financial/charges')}
            onConfirm={() => router.push('/financial/charges')}
        />
    )
}

NewChargePage.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <ChargeLayout>{page}</ChargeLayout>
    )
}

NewChargePage.appendLayout = true

export default NewChargePage
