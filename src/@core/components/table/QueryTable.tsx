import React, { useState } from 'react'
import { Column } from './types'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import Table, { TableProps } from './Table'

export type Columns = Column[]
export type DataItem = any

type QueryFn = (page: number, pageSize: number) => Promise<any>

export type QueryTableProps = Omit<TableProps, 'data' | 'loading'> & {
    queryFn: QueryFn
    queryKey: UseQueryOptions['queryKey']
}

function QueryTable({ queryFn, queryKey, ...props }: QueryTableProps) {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const dataQuery = useQuery({
        queryKey: [...(queryKey || []), page, pageSize],
        queryFn: () => queryFn?.(page, pageSize)!,
        select: (response: { data: { results: any; count: number } }) => response.data,
        enabled: Boolean(queryFn)
    })

    const data = (dataQuery.data?.results || []) as any[]
    const count = dataQuery.data?.count || 0
    return (
        <Table
            {...props}
            data={data}
            rowCount={count}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            showPageSizeOptions
            loading={dataQuery.isLoading}
        />
    )
}

export default QueryTable
