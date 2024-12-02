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

export enum CollectionTypes {
    fractional = 'fractional',
    fixed = 'fixed'
}

export const CollectionOptions = {
    [CollectionTypes.fractional]: 'Por rateio',
    [CollectionTypes.fixed]: 'Por taxa fixa'
}

export enum CollectionFormat {
    single = 'single',
    recurrent = 'recurrent',
    installments = 'installments'
}

export const CollectionFormatOptions = {
    [CollectionFormat.single]: 'Única',
    [CollectionFormat.recurrent]: 'Recorrente',
    [CollectionFormat.installments]: 'Parcelada'
}
