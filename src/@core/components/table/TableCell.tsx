import React from 'react'
import { Column } from './types'

export type TableCellProps = Omit<Column, 'cell' | 'renderCell'> & {
    children?: Column['cell']
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TableCell(_props: TableCellProps) {
    return <></>
}

export default TableCell
