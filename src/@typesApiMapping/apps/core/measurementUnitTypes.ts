import { HomespaceBaseModel } from './homeSpaceBaseModelTypes'

export type MeasurementUnitType = HomespaceBaseModel & {
    description: string
    character_abbreviation: string
}

export const MeasurementUnitTypeDescription = {
    m: 'm - Metro',
    cm: 'c - Centímetro',
    mm: 'mm - Milímetro',
    kg: 'kg - Quilograma',
    g: 'g - Grama',
    l: 'l - Litro',
    un: 'un - Unidade',
    m2: 'm2 - Metro Quadrado',
    m3: 'm3 - Metro Cúbico',
    'kw/h': 'kw/h - Quilowatt Hora'
}
