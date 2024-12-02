import { createUrl } from './Url'

export const HomespacePayService = {
    account: createUrl<null, any>('/homespace-pay/account/'),
    finance_balance: createUrl<null, { balance: number }>('/homespace-pay/finance/balance'),
    payment: createUrl<null>('/homespace-pay/payment'),
    payment_getBoleto: createUrl<{ paymentId: string }, any>('/homespace-pay/payment/:paymentId/boleto'),
    action_create_authorization: createUrl('/homespace-pay/action/create-authorization'),
    action_validate_authorization: createUrl('/homespace-pay/action/validate-authorization'),
    transfer: createUrl('/homespace-pay/transfer')
}
