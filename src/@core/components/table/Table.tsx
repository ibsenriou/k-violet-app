import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import TableCell from '@mui/material/TableCell'
import React, { useState } from 'react'
import { TableCellProps } from './TableCell'
import { Column } from './types'
import TextField from '../inputs/TextField'
import formatter, { FormatTypeValue } from '@core/utils/formatter'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import DataGridLocaleText from './localeText'
import LinearProgress from '@mui/material/LinearProgress'

export type Columns = Column[]
export type DataItem = any

export type TableProps = {
    title?: string
    topRightActionCallback?: () => void
    topRightActionLabel?: string
    columns?: Columns
    data: DataItem[]
    noRowsMessage?: string
    children?: (React.ReactElement<typeof TableCell> | false)[]
    onRowClick?: (row: DataItem) => void
    searchField?: string | string[]
    hideHeaders?: boolean
    loading?: boolean
    noRowsFilterMessage?: string
    showExport?: boolean
    page?: number
    rowCount?: number
    pageSize?: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    paginationMode?: 'server' | 'client'
    showPageSizeOptions?: boolean
    disablePagination?: boolean
    disableRowSelectionOnClick?: boolean
    footerElement?: React.JSXElementConstructor<any> | undefined
    footerElementProps?: Record<string, any>
    defaultPageSize?: number
}

function Toolbar({ showExport }: { showExport?: boolean }) {
    if (!showExport) {
        return null
    }

    return (
        <GridToolbarContainer>
            <GridToolbarExport
                style={{
                    marginLeft: 'auto'
                }}
            />
        </GridToolbarContainer>
    )
}

function Table({
    title,
    topRightActionCallback,
    topRightActionLabel,
    columns,
    data,
    noRowsMessage,
    children,
    onRowClick,
    searchField,
    noRowsFilterMessage,
    showExport,
    page,
    rowCount,
    pageSize,
    onPageChange,
    onPageSizeChange,
    paginationMode,
    showPageSizeOptions,
    disablePagination,
    disableRowSelectionOnClick,
    footerElement,
    footerElementProps,
    loading,
    defaultPageSize
}: TableProps) {
    const [_page, _setPage] = useState(0)
    const [_pageSize, _setPageSize] = useState(defaultPageSize || 10)

    const [searchValue, setSearchValue] = useState('')

    function normalizeProps(columns: Columns) {
        let _columns = Array.from(columns.map(c => ({ ...c })))
        for (const column of _columns) {
            if ('cell' in column) {
                if (column.cell) {
                    column.renderCell = column.cell
                }
                delete column.cell
            }
            if ('children' in column) {
                if (column.children) {
                    column.renderCell = column.children as unknown as Column['renderCell']
                }
                delete column.children
            }
            if ('header' in column) {
                if (column.header) {
                    column.headerName = column.header
                }
                delete column.header
            }
            if ('hide' in column) {
                if (column.hide) {
                    column.hide = true
                }
                delete column.hide
            }
            if ('formatType' in column) {
                if (column.formatType) {
                    const format = formatter(column.formatType)
                    column.renderCell = ({ value }: { value: any }) => (
                        <Box className='MuiDataGrid-cellContent'>{format(value as FormatTypeValue)}</Box>
                    )
                }
                delete column.formatType
            }
            if ('format' in column) {
                if (column.format) {
                    const format = column.format
                    column.renderCell = ({ value }: { value: any }) => (
                        <Box className='MuiDataGrid-cellContent'>{format(value as FormatTypeValue)}</Box>
                    )
                }
                delete column.format
            }
            if ('align' in column) {
                if (column.align) {
                    column.headerAlign = column.align
                }
            }
            column.flex = column.flex == undefined ? 1 : column.flex
            if ('width' in column) {
                delete column.flex
            }

            if (column.field == 'actions') {
                column.flex = 0
                column.disableColumnMenu = true
                column.hideSortIcons = true
                column.disableExport = true
                column.disableReorder = true
            }
        }

        return _columns
    }

    function getColumns() {
        if (!children) {
            return columns || []
        }
        return React.Children.map(children, (child: React.ReactElement<typeof TableCell> | boolean) => {
            if (!child) {
                return
            }
            const props = (child as React.ReactElement).props as unknown as TableCellProps

            return {
                ...props,
                cell: props.children
            } as Column
        })
    }
    const _columns = normalizeProps(getColumns())

    const filteredData = data.filter(row => {
        if (!searchField) {
            return true
        }
        let searchFields = Array.isArray(searchField) ? searchField : [searchField]
        if (searchField === 'all') {
            searchFields = _columns.map(c => c.field as string)
        }

        for (const searchField of searchFields) {
            const column = _columns.find(c => c.field === searchField)

            let value = row[searchField as keyof DataItem]

            if (column?.formatType) {
                const format = formatter(column.formatType)
                value = format(value as FormatTypeValue)
            }
            if (column?.format) {
                value = column.format(value)
            }

            if (typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase())) {
                return true
            }
        }

        return false
    })

    const columnVisibilityModel = _columns.reduce((acc, column) => {
        acc[column.field as string] = !column.hide
        return acc
    }, {} as Record<string, boolean>)

    const pageSizes = showPageSizeOptions ? [10, 25, 50, 100] : []
    if (defaultPageSize && !pageSizes.includes(defaultPageSize)) {
        pageSizes.push(defaultPageSize)
        pageSizes.sort((a, b) => a - b)
    }

    return (
        <>
            {(searchField || (topRightActionCallback && topRightActionLabel)) && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!searchField ? (
                        <CardHeader
                            title={title || ''}
                            titleTypographyProps={{
                                variant: 'h6',
                                height: topRightActionCallback && topRightActionLabel ? '20px' : undefined
                            }}
                        />
                    ) : (
                        <Box margin={2}>
                            <TextField
                                size='small'
                                name='search-table-field'
                                label={title || 'Pesquisar'}
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                showClear
                            />
                        </Box>
                    )}
                    {topRightActionCallback && topRightActionLabel && (
                        <Button sx={{ marginRight: 3 }} variant='contained' onClick={topRightActionCallback}>
                            {topRightActionLabel}
                        </Button>
                    )}
                </Box>
            )}
            <Divider sx={{ margin: 0 }} />
            <DataGrid
                sx={{
                    '& .MuiTablePagination-root': {
                        visibility: disablePagination ? 'hidden' : 'visible'
                    }
                }}
                loading={loading}
                autoHeight
                rows={filteredData}
                columns={_columns}
                onRowClick={onRowClick}
                page={page || _page}
                rowCount={rowCount}
                pageSize={pageSize || _pageSize}
                onPageChange={onPageChange || _setPage}
                paginationMode={paginationMode || 'client'}
                onPageSizeChange={onPageSizeChange || _setPageSize}
                rowsPerPageOptions={pageSizes}
                disableSelectionOnClick={disableRowSelectionOnClick}
                localeText={{
                    ...DataGridLocaleText,
                    noRowsLabel:
                        (data.length === 0 ? noRowsMessage : noRowsFilterMessage) || DataGridLocaleText.noRowsLabel
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: columnVisibilityModel
                    }
                }}
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: 'Linhas por página',
                        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
                            `${from}-${to} de ${count}`
                    },
                    toolbar: {
                        showExport: showExport
                    },
                    footer: footerElementProps
                }}
                components={{
                    Toolbar: Toolbar,
                    Footer: footerElement,
                    LoadingOverlay: LinearProgress
                }}
            />
        </>
    )
}

export default Table
