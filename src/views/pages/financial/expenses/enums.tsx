export enum RecurrenceTypes {
    monthly = 'monthly',
    bimonthly = 'bimonthly',
    quarterly = 'quarterly',
    semiannual = 'semiannual',
    annual = 'annual'
}

export const RecurrenceOptions = {
    [RecurrenceTypes.monthly]: 'Mensal',
    [RecurrenceTypes.bimonthly]: 'Bimestral',
    [RecurrenceTypes.quarterly]: 'Trimestral',
    [RecurrenceTypes.semiannual]: 'Semestral',
    [RecurrenceTypes.annual]: 'Anual'
}

export const RecurrenceLabels = {
    [RecurrenceTypes.monthly]: (value: number) => (value > 1 ? 'Meses' : 'Mês'),
    [RecurrenceTypes.bimonthly]: (value: number) => (value > 1 ? 'Bimestres' : 'Bimestre'),
    [RecurrenceTypes.quarterly]: (value: number) => (value > 1 ? 'Trimestres' : 'Trimestre'),
    [RecurrenceTypes.semiannual]: (value: number) => (value > 1 ? 'Semestres' : 'Semestre'),
    [RecurrenceTypes.annual]: (value: number) => (value > 1 ? 'Anos' : 'Ano')
}

export enum ExpenseTypes {
    ordinary = 'ordinary',
    extraordinary = 'extraordinary'
}

export const ExpenseTypesOptions = {
    [ExpenseTypes.ordinary]: 'Ordinária',
    [ExpenseTypes.extraordinary]: 'Extraordinária'
}

export enum ExpenseFormat {
    unique = 'unique',
    recurrent = 'recurrent',
    installments = 'installments'
}

export const ExpenseFormatOptions = {
    [ExpenseFormat.unique]: 'Única',
    [ExpenseFormat.recurrent]: 'Recorrente',
    [ExpenseFormat.installments]: 'Parcelada'
}

export enum ExpenseStatus {
    pending = 'pending',
    paid = 'paid',
    overdue = 'overdue',
    canceled = 'canceled'
}

export const ExpenseStatusOptions = {
    [ExpenseStatus.pending]: 'Pendente',
    [ExpenseStatus.paid]: 'Pago',
    [ExpenseStatus.overdue]: 'Atrasado',
    [ExpenseStatus.canceled]: 'Cancelado'
}

export enum PaymentMethods {
    cash = 'cash',
    bank_slip = 'bank_slip',
    bank_transfer = 'bank_transfer',
    check = 'check',
    credit_card = 'credit_card',
    debit_card = 'debit_card',
    pix = 'pix'
}

export const PaymentMethodsOptions = {
    [PaymentMethods.cash]: 'Dinheiro',
    [PaymentMethods.bank_slip]: 'Boleto',
    [PaymentMethods.bank_transfer]: 'Transferência bancária',
    [PaymentMethods.check]: 'Cheque',
    [PaymentMethods.credit_card]: 'Cartão de crédito',
    [PaymentMethods.debit_card]: 'Cartão de débito',
    [PaymentMethods.pix]: 'Pix'
}

