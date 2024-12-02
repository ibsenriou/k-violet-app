import React from 'react'
import { CondominiumUserOccurrenceType } from '@typesApiMapping/apps/condominium/condominiumUserOccurrenceTypes'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { Box, IconButton } from '@mui/material'
import { EyeOutline } from 'mdi-material-ui'
import { DataParams } from '@core/components/table/types'
import {
    UserOccurrencePrivacy,
    UserOccurrencePrivacyOptions,
    UserOccurrenceStatus,
    UserOccurrenceStatusOptions
} from '../../enums'

type UserOccurrenceTableProps = {
    occurrences: CondominiumUserOccurrenceType[]
    onViewOccurrence: (occurrenceId: string) => void
    loading?: boolean
}

export default function UserOccurrenceTable({ occurrences, onViewOccurrence, loading }: UserOccurrenceTableProps) {
    return (
        <Table data={occurrences} loading={loading}>
            <TableCell field='title' />
            <TableCell field='lookup_type_of_condominium_user_occurrence' />
            <TableCell field='created_by_name' />
            <TableCell field='privacy' format={(v: UserOccurrencePrivacy) => UserOccurrencePrivacyOptions[v]} />
            <TableCell field='created_at' formatType='date' />
            <TableCell field='current_status' format={(v: UserOccurrenceStatus) => UserOccurrenceStatusOptions[v]} />
            <TableCell field='conclusion_date' formatType='date' />
            <TableCell field='actions'>
                {({ row }: DataParams<CondominiumUserOccurrenceType>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewOccurrence(row.id)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
