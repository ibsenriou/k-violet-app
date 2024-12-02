import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'
import { CollectionFormat, RecurrenceLabels, RecurrenceOptions, RecurrenceTypes } from '../../../collection/enums'
import type { Theme } from '@mui/material'

type ApportionmentInfoProps = {
    collection: CollectionType
}
export default function ApportionmentDetails({ collection }: ApportionmentInfoProps) {
    return (
        <Box display='grid' gap='8px'>
            {collection.format != CollectionFormat.single && (
                <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                    <TextField
                        name='recurrence_type'
                        label={
                            collection.format == CollectionFormat.recurrent
                                ? 'Tipo de Recorrencia'
                                : 'Tipo de parcelamento'
                        }
                        disabled
                        value={RecurrenceOptions[collection.recurrence_type as RecurrenceTypes]}
                    />
                    <TextField
                        label={collection.format == CollectionFormat.recurrent ? 'Recorrencia' : 'Parcelas'}
                        disabled
                        defaultValue={collection.recurrence_value}
                        InputProps={{
                            endAdornment: RecurrenceLabels[collection.recurrence_type as RecurrenceTypes](
                                collection.recurrence_value
                            )
                        }}
                    />
                    <TextField
                        value={collection.recurrence_index}
                        label='Parcela Atual'
                        disabled
                        helperText='Caso arrecadação em andamento'
                    />
                </Box>
            )}
            <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                <TextField
                    value={collection.amount / 100}
                    label='Valor'
                    type='number'
                    disabled
                    InputProps={{
                        startAdornment: (
                            <Typography
                                variant='body1'
                                paddingRight='4px'
                                sx={(theme: Theme) => ({
                                    color: theme.palette.text.secondary
                                })}
                            >
                                R$
                            </Typography>
                        )
                    }}
                />
                {collection.type == 'fractional' && (
                    <TextField
                        name='fk_ideal_fraction'
                        label='Tipo de Rateio'
                        disabled
                        defaultValue={collection.ideal_fraction_name}
                    />
                )}
            </Box>
            <Box>
                <Table data={collection.items} showPageSizeOptions>
                    <TableCell field='uhab_name' header='Unidade' />
                    <TableCell field='competence' header='Competencia' valueGetter={() => collection.competence} />
                    <TableCell field='description' header='Descrição' valueGetter={() => collection.description} />
                    <TableCell field='amount' header='Valor' formatType='currency' />
                </Table>
            </Box>
        </Box>
    )
}
