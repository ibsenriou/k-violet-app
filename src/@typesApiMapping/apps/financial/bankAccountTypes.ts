import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'


export type BankAccountType = HomespaceBaseModel & {
    id: string
    name: string
    description: string
    fk_bank: string
    account_agency: string
    account_number: string
    account_number_digit: string

    is_main_account: boolean
    fk_lookup_type_of_bank_account: string
}

export type NewBankAccountType = Omit<BankAccountType, keyof HomespaceBaseModel>
