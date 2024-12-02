import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type SupplierType = HomespaceBaseModel & {
    fk_person: string
    name: string
    identification: string
    email: string
    cell_phone_number: string
}

export type CreateSupplierType = SupplierType & {
    fk_person: string | null
}

export type SearchSupplierType = SupplierType & {
    is_supplier: boolean
}
