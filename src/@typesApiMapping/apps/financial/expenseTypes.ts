import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type ExpenseItemType = HomespaceBaseModel & {
    id: string
    fk_item: string
    fk_expense: string
    amount: number
    quantity: number

    item_name: string
}

export type ExpenseType = HomespaceBaseModel & {
    id: string
    fk_supplier: string
    competence: number
    amount: number
    due_date: string
    payment_date: string
    launch_date: string
    expense_type: number
    status: string
    description: string
    recurrence_index: number
    recurrence_value: number
    expense_format: number
    recurrence_type: number
    items: ExpenseItemType[]
    fk_parent_collection: string | null

    supplier_name: string

    expense_status_label: 'paid' | 'pending' | 'overdue' | 'canceled'
    expense_type_label: 'ordinary' | 'extraordinary'
    expense_format_label: 'unique' | 'recurrent' | 'installments'
    expense_recurrence_type_label: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual'
}

export type ExpenseLiquidationType = HomespaceBaseModel & {
    fk_bank_account: string
    payment_method: number
    payment_date: string
    interest: number
    discount: number
    fine: number
    original_amount: number
    final_amount: number

    fk_expense: string

    payment_method_label: 'cash' | 'bank_slip' | 'bank_transfer' | 'check' | 'credit_card' | 'debit_card' | 'pix'
}
