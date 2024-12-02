import { Charge, NewChargeCollection } from '@typesApiMapping/apps/financial/chargeTypes'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import { createUrl } from './Url'

export const FinancialService = {
    collections: createUrl('/financial/collection/'),
    collection_id: createUrl<{ collectionId: string; multiple: boolean }>(
        '/financial/collection/:collectionId?multiple=:multiple'
      ),
      bank_accounts: createUrl('/financial/bank_account/'),
      bank_account_id: createUrl<{ bankAccountId: string }>(
          '/financial/bank_account/:bankAccountId'
      ),
      charges: createUrl<undefined, Charge[]>('/financial/charge/'),
    charges_collections_by_competence: createUrl<undefined, { data: NewChargeCollection[]; hash: string }>(
        '/financial/charge_collections_by_competence/'
    ),
    charge_id: createUrl<{ chargeId: string }, Charge>('/financial/charge/:chargeId/'),
    charge_id_pay: createUrl<{ chargeId: string }, Charge>('/financial/charge/:chargeId/pay/'),
    expenses: createUrl<ExpenseType[]>('/financial/expense/'),
    expense_id: createUrl<{ expenseId: string }, ExpenseType>('/financial/expense/:expenseId/'),
    expenses_id_pay: createUrl<{ expenseId: string }, ExpenseType>('/financial/expense/:expenseId/pay/'),
}
