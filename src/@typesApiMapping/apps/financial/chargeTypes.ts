export type NewChargeCollectionItem = {
    id: string
    collection_description: string
    amount: number
    recurrence_index: number
    recurrence_value: number
    format: string
}

export type NewChargeCollection = {
    id: string
    name: string
    responsible_label: string
    fk_responsible: string
    responsible_name: string
    type_of_uhab_user_role: string
    competence: number
    total_amount: number
    items: NewChargeCollectionItem[]
}

export type Charge = {
    fk_uhab: string
    fk_responsible: string
    due_date: string
    competence: number
    amount: number
    status: string
    payment_date: string

    uhab_name: string
    responsible_name: string
    status_label: string
}