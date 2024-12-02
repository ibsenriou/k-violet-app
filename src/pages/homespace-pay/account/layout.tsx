import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { HomespacePayService } from 'src/services/homespacePayService'
import AccountView from 'src/views/pages/homespace-pay/account/Account'

export default function Account({ children }: { children: React.ReactNode }) {
    const route = useRouter()
    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: () => HomespacePayService.account.get(),
        select: data => data?.data
    })

    if (accountQuery.isLoading) {
        return null
    }

    if (!accountQuery.data) {
        route.push('/homespace-pay/account/create')

        return null
    }

    if (accountQuery.data.status != 'active') {
        route.push('/homespace-pay/account/pending-documents')

        return null
    }

    function onClickCreatePayment() {
        route.push('/homespace-pay/account/create-payment')
    }

    function onClickCreateTransference() {
        route.push('/homespace-pay/account/create-transference')
    }

    return (
        <>
            <AccountView
                onClickCreatePayment={onClickCreatePayment}
                onClickCreateTransference={onClickCreateTransference}
            />
            {children}
        </>
    )
}
