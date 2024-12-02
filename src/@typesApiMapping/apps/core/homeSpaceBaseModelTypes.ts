export type HomespaceBaseModel = {
    id: string
    created_at: string
    updated_at: string
    deactivated_at: string | null
    created_by: string
    updated_by: string
    deactivated_by: string | null
    fk_condominium: string

    created_by_name: string
}
