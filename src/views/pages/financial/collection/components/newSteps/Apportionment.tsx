import SelectField from '@core/components/inputs/SelectField'
import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import type { Theme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import type { ApportionmentSchemaType } from '../../NewCollection'
import { useQuery } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import moment, { Moment } from 'moment'
import { useUhabs } from '../../hooks'
import { useEffect } from 'react'
import { CollectionFormat, CollectionTypes, RecurrenceLabels, RecurrenceOptions, RecurrenceTypes } from '../../enums'

type ApportionmentInfoProps = {
    format: CollectionFormat
    type: CollectionTypes
    competence: Moment
}
export default function ApportionmentInfo({ format, type, competence }: ApportionmentInfoProps) {
    const form = useFormContext<ApportionmentSchemaType>()
    const amount = form.watch('amount')

    const fractionsQuery = useQuery({
        queryKey: ['IdealFraction'],
        queryFn: () => CondominiumService.ideal_fraction.get().then(response => response.data),
        select: data => data.results
    })
    const uhabIdealFractionQuery = useQuery({
        queryKey: ['UhabIdealFraction', form.watch('fk_ideal_fraction')],
        queryFn: () =>
            CondominiumService.uhab_ideal_fraction
                .get({ fk_ideal_fraction: form.watch('fk_ideal_fraction') })
                .then(response => response.data),
        select: data => data.results.map(item => ({ ...item, percentage: Number(item.percentage).toFixed(5) }))
    })

    const uhabs = useUhabs()

    const selectedUHabs = form
        .watch('fk_uhabs')
        ?.map(id => uhabs.find(uhab => uhab.id === id))
        .sort((a, b) => a?.name.localeCompare(b?.name || '') || 0)

    const recurrenceTypeMultipliers = {
        [RecurrenceTypes.monthly]: 1,
        [RecurrenceTypes.bimonthly]: 2,
        [RecurrenceTypes.quarterly]: 3,
        [RecurrenceTypes.semiannual]: 6,
        [RecurrenceTypes.annual]: 12
    }
    const currentRecurrenceMultiplier = recurrenceTypeMultipliers[form.watch('recurrence_type') as RecurrenceTypes] || 1

    const competenceCount = form.watch('recurrence_value') || 1
    const competenceList = Array.from(
        { length: competenceCount - Number(form.watch('recurrence_initial_index')) + 1 },
        (_, i) => i
    ).map(i =>
        moment(competence)
            .startOf('month')
            .add(i * currentRecurrenceMultiplier, 'months')
    )

    const totalPercentageSelected = selectedUHabs?.reduce(
        (acc, uhab) => acc + Number(uhabIdealFractionQuery.data?.find(i => i.fk_uhab === uhab?.id)?.percentage || 0),
        0
    )
    const relativePercentageFractions = selectedUHabs?.map(uhab => ({
        id: uhab?.id,
        percentage:
            Number(uhabIdealFractionQuery.data?.find(i => i.fk_uhab === uhab?.id)?.percentage || 0) /
            totalPercentageSelected
    }))

    const resume = competenceList.flatMap(
        (competence, index) =>
            selectedUHabs?.map(uhab => ({
                id: `${uhab?.name}-${uhab?.type}-${competence.toISOString()}`,
                uhab: `${uhab?.name} - ${uhab?.type}`,
                competence: competence.format('MM/YYYY'),
                description: `${Number(index) + Number(form.watch('recurrence_initial_index'))} de ${competenceCount}`,
                value:
                    type === 'fixed'
                        ? amount
                        : ((Number(relativePercentageFractions?.find(i => i.id === uhab?.id)?.percentage) || 0) *
                              (amount || 0)) /
                          (format == CollectionFormat.installments ? form.watch('recurrence_value') : 1)
            })) || []
    )

    useEffect(() => {
        if (type == 'fractional') {
            const fk_uhabs = uhabIdealFractionQuery.data?.map(i => i.fk_uhab)
            const selectedUhabs = uhabs.filter(uhab => fk_uhabs?.includes(uhab.id)).map(uhab => uhab.id)
            form.setValue('fk_uhabs', selectedUhabs || [])
        }
    }, [uhabIdealFractionQuery.data, type])

    return (
        <Box display='grid' gap='8px'>
            {format != CollectionFormat.single && (
                <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                    <SelectField
                        control={form.control}
                        name='recurrence_type'
                        label='Recorrencia'
                        defaultValue={RecurrenceTypes.monthly}
                        items={Object.entries(RecurrenceOptions).map(([key, value]) => ({ label: value, value: key }))}
                    />
                    <Controller
                        name='recurrence_value'
                        control={form.control}
                        render={({ field }) => (
                            <TextField
                                label=''
                                {...field}
                                InputProps={{
                                    endAdornment: RecurrenceLabels[form.watch('recurrence_type') as RecurrenceTypes](
                                        field.value
                                    )
                                }}
                            />
                        )}
                    />
                    <Controller
                        name='recurrence_initial_index'
                        control={form.control}
                        render={({ field }) => (
                            <TextField
                                label='Parcela Inicial'
                                helperText='Caso arrecadação em andamento'
                                defaultValue={1}
                                {...field}
                            />
                        )}
                    />
                </Box>
            )}
            <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='8px'>
                <Controller
                    name='amount'
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value / 100}
                            onChange={e =>
                                field.onChange({ target: { value: Number(e.target.value) * 100 }, name: field.name })
                            }
                            label='Valor'
                            type='number'
                            InputProps={{
                                startAdornment: (
                                    <Typography
                                        variant='body1'
                                        paddingRight='4px'
                                        sx={(theme: Theme) => ({
                                            color: !!form.formState.errors.amount
                                                ? theme.palette.error.main
                                                : theme.palette.text.secondary
                                        })}
                                    >
                                        R$
                                    </Typography>
                                )
                            }}
                            error={!!form.formState.errors.amount}
                            helperText={form.formState.errors.amount?.message}
                        />
                    )}
                />
                {type == 'fractional' && (
                    <SelectField
                        control={form.control}
                        name='fk_ideal_fraction'
                        label='Tipo de Rateio'
                        items={fractionsQuery.data?.map(i => ({ label: i.description, value: i.id })) || []}
                    />
                )}
                <Controller
                    name='fk_uhabs'
                    control={form.control}
                    defaultValue={uhabIdealFractionQuery.data?.map(i => i.fk_uhab) || []}
                    key={form.watch('fk_ideal_fraction') + uhabIdealFractionQuery.dataUpdatedAt}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            limitTags={1}
                            options={uhabs.map(h => h.id)}
                            multiple
                            onChange={(_, data) => field.onChange(data)}
                            value={field.value}
                            groupBy={option => uhabs.find(h => h.id == option)?.type || ''}
                            getOptionLabel={option => uhabs.find(h => h.id == option)?.name || ''}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label='Para'
                                    error={!!form.formState.errors.fk_uhabs}
                                    helperText={(form.formState.errors.fk_uhabs as unknown as FieldError)?.message}
                                />
                            )}
                        />
                    )}
                />
            </Box>
            <Box>
                <Table data={resume} showPageSizeOptions key={selectedUHabs?.length}>
                    <TableCell field='uhab' header='Unidade' />
                    <TableCell field='competence' header='Competencia' />
                    <TableCell field='description' header='Descrição' />
                    <TableCell field='value' header='Valor' formatType='currency' />
                </Table>
            </Box>
        </Box>
    )
}
