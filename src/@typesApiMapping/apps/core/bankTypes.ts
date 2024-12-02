import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type BankType = HomespaceBaseModel & {
    bank_code: string
    bank_name: string
}
