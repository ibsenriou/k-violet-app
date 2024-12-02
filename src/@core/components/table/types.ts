import { FormatType } from '@core/utils/formatter'
import { GridEnrichedColDef } from '@mui/x-data-grid'

export type Column = Omit<GridEnrichedColDef, 'hide'> & {
    cell?: GridEnrichedColDef['renderCell']
    format?: (value: any) => string
    formatType?: FormatType
    header?: string
    hide?: boolean
    valueFormatter?: (value: any) => string
    children?: any
}

export type DataParams<T> = {
    row: T
    value: any
}
