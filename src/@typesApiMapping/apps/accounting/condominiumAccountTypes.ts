import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type CondominiumAccountType = HomespaceBaseModel & {
    fk_account: string
    fk_condominium: string
}
