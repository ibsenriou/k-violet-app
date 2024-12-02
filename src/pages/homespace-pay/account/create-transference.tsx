import { ReactNode } from 'react'
import Account from './layout'
import CreateTransferenceView from 'src/views/pages/homespace-pay/account/CreateTransference'
import { useRouter } from 'next/router'

export default function CreateTransference() {
    const route = useRouter()

    return <CreateTransferenceView onClose={() => route.push('/homespace-pay/account')} />
}

CreateTransference.appendLayout = true
CreateTransference.getLayout = function getLayout(page: ReactNode) {
    return <Account>{page}</Account>
}
