import CreatePaymentView from 'src/views/pages/homespace-pay/account/CreatePayment'
import Account from './layout'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'

export default function CreatePayment() {
    const route = useRouter()

    return <CreatePaymentView onCancel={() => route.push('/homespace-pay/account')} />
}

CreatePayment.appendLayout = true
CreatePayment.getLayout = function getLayout(page: ReactNode) {
    return <Account>{page}</Account>
}
