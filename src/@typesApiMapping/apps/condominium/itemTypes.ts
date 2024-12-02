import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type ItemType = HomespaceBaseModel & {
    name: string
    fk_account: string
}
