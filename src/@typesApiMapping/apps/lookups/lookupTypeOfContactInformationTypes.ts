import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type LookupTypeOfContactInformationType = HomespaceBaseModel & {
    description: string
}

export type LookupTypeOfContactInformationTypeEnum = {
    TelefoneCelular: string
    TelefoneResidencial: string
    TelefoneComercial: string
    Email: string
}
