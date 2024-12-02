import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type UhabType = HomespaceBaseModel & {
    name: string
    description?: string

    // TODO - fk_uhab is the id of the base Object Uhab and in the modeling it can be null, even if most of the time it is not null.
    fk_uhab?: string
}
