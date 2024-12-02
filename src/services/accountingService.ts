import { createUrl } from './Url'
import { AccountType } from '@typesApiMapping/apps/accounting/accountTypes'
import { CondominiumAccountType } from '@typesApiMapping/apps/accounting/condominiumAccountTypes'

export const AccountingService = {
    account: createUrl<null, AccountType[]>('/accounting/account/'),
    accountId: createUrl<{ accountId: string }, AccountType>('/accounting/account/:accountId/'),
    condominiumAccounts: createUrl('/accounting/condominium_account/'),
    condominiumAccountId: createUrl<{ condominiumAccountId: string }, CondominiumAccountType>(
        '/accounting/condominium_account/:condominiumAccountId/'
    )
}
