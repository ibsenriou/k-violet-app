import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export enum NatureOfOperation {
    CREDIT = 1,
    DEBIT = 2
}

export enum Type {
    SYNTHETIC = 1,
    ANALYTIC = 2
}

export const NatureOfOperationLabels = {
    [NatureOfOperation.CREDIT]: 'Crédito',
    [NatureOfOperation.DEBIT]: 'Débito'
}

export type AccountType = HomespaceBaseModel & {
    nature_of_operation: NatureOfOperation
    type: Type
    description: string
    is_global: boolean
    code: string
    fk_account: string
}
