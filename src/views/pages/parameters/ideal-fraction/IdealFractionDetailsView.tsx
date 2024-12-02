import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiTextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import { DataParams } from '@core/components/table/types'
import {
    DistributionType,
    IdealFractionItemsUpdateType,
    IdealFractionType
} from '@typesApiMapping/apps/condominium/idealFractionTypes'
import { useAppSelector } from 'src/store'
import { selectCondominium } from 'src/store/apps/condominium/about-the-condominium'
import { useEffect, useState } from 'react'
import { DjangoModelViewSetDefaultResponse } from 'src/services/Url'
import { useForm } from 'react-hook-form'
import TextField from '@core/components/inputs/TextField'
import ConfirmationDialog from '@core/components/confirmation-dialog'
import { UhabIdealFractionType } from '@typesApiMapping/apps/condominium/uhabIdealFractionTypes'
import { useRouter } from 'next/router'
import { UhabType } from '@typesApiMapping/apps/condominium/uhabTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'
import { LookupsService } from 'src/services/lookupsService'
import SaveConfirmationDialogIdealFraction from './SaveConfirmationDialogIdealFraction'

type IdealFractionItem = {
    id: string
    fk_uhab: string
    fk_ideal_fraction: string
    percentage: string
    uhab_name: string
    uhab_grouping: string
}

type IdealFractionDetailsViewProps = {
    idealFractionId: string
}

export default function IdealFractionDetailsView({ idealFractionId }: IdealFractionDetailsViewProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<IdealFractionType>()
    const router = useRouter()
    const [formDisabled, setFormDisabled] = useState(true)
    const [isMain, setIsMain] = useState(false)
    const [isActivated, setIsActivated] = useState(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false)

    const [items, setItems] = useState<IdealFractionItem[]>([])

    const queryClient = useQueryClient()
    const idealFractionQuery = useQuery({
        queryKey: ['IdealFraction', idealFractionId],
        queryFn: () =>
            CondominiumService.ideal_fraction_by_id
                .get({ idealFractionId: idealFractionId })
                .then(response => response.data)
                .then(data => {
                    setIsMain(data.is_main)
                    setIsActivated(data.activated_at != null)
                    setValue('description', data.description)
                    setValue('distribution_type', data.distribution_type)
                    return data
                }),
        initialData: () => {
            const idealFraction = (
                queryClient.getQueryData(['IdealFraction']) as DjangoModelViewSetDefaultResponse<IdealFractionType[]>
            )?.results.find(ideal => ideal.id === idealFractionId)

            if (idealFraction) {
                setIsMain(idealFraction.is_main)
                setIsActivated(idealFraction.activated_at != null)
                setValue('description', idealFraction.description)
                setValue('distribution_type', idealFraction.distribution_type)
            }
            return idealFraction
        }
    })

    const condominium = useAppSelector(selectCondominium)
    const lookupTypeOfResidential = useQuery({
        queryKey: ['LookupTypeOfResidential'],
        queryFn: () => LookupsService.lookup_type_of_residential.get().then(response => response.data),
        select: data => data.results
    })
    const typeOfResidential = lookupTypeOfResidential.data

    const lookupTypeOfCommecial = useQuery({
        queryKey: ['LookupTypeOfCommercial'],
        queryFn: () => LookupsService.lookup_type_of_commercial.get().then(response => response.data),
        select: data => data.results
    })
    const typeOfCommecial = lookupTypeOfCommecial.data

    const residentialQuery = useQuery({
        queryKey: ['Residential'],
        queryFn: () => CondominiumService.residential.get().then(response => response.data),
        select: data => data.results.sort((a, b) => a.name.localeCompare(b.name))
    })

    const commercialQuery = useQuery({
        queryKey: ['Commercial'],
        queryFn: () => CondominiumService.commercial.get().then(response => response.data),
        select: data => data.results
    })

    const units = [
        ...((residentialQuery.data || []) as UhabType[]),
        ...((commercialQuery.data || []) as UhabType[])
    ] as (UhabType & {
        residential_grouping?: string
        commercial_grouping?: string
    })[]

    const uhabIdealFractionQuery = useQuery({
        queryKey: ['UhabIdealFraction', idealFractionId],
        queryFn: () =>
            CondominiumService.uhab_ideal_fraction
                .get({ fk_ideal_fraction: idealFractionId })
                .then(response => response.data),
        select: data => data.results.map(item => ({ ...item, percentage: Number(item.percentage).toFixed(5) }))
    })

    const updateIdealFractionMutation = useMutation({
        mutationFn: (data: IdealFractionItemsUpdateType) =>
            CondominiumService.ideal_fraction_update_items.post(null, data).then(response => response.data),
        onSuccess: result => {
            queryClient.invalidateQueries({ queryKey: ['IdealFraction'] })
            queryClient.invalidateQueries({ queryKey: ['IdealFraction', idealFractionId] })
            queryClient.invalidateQueries({ queryKey: ['UhabIdealFraction', idealFractionId] })
            setFormDisabled(true)
            router.push('/parameters/ideal-fraction/')
        }
    })

    const fractionList: IdealFractionItem[] =
        units?.map(unit => {
            const editedFraction = items.find(item => item.fk_uhab === unit.id)
            const fraction = uhabIdealFractionQuery.data?.find(fraction => fraction.fk_uhab === unit.id)

            const idealItemsMerged = items as any
            for (const itemFraction of uhabIdealFractionQuery?.data || []) {
                if (idealItemsMerged.find((item: any) => item.fk_uhab === itemFraction.fk_uhab)) continue
                idealItemsMerged.push(itemFraction)
            }

            let percentage = '0.00000'
            if (DistributionType.MANUAL_DISTRIBUTION === idealFractionQuery.data?.distribution_type) {
                percentage =
                    editedFraction?.percentage !== undefined
                        ? editedFraction?.percentage
                        : Number(fraction?.percentage || 0).toFixed(5) || '0.00000'
            } else {
                const uhabPercentage = editedFraction?.percentage || fraction?.percentage || '0.00000'
                if (Number(uhabPercentage) !== 0) {
                    let calcPercentage =
                        100 /
                        (units.length - idealItemsMerged.filter((item: any) => Number(item.percentage) === 0).length)
                    percentage = calcPercentage.toFixed(5)
                } else {
                    percentage = '0.00000'
                }
            }
            let abbreviatedType = ''
            if ((unit as ResidentialType)?.fk_lookup_type_of_residential) {
                const residentialType = typeOfResidential?.find(
                    type => type.id === (unit as ResidentialType)?.fk_lookup_type_of_residential
                )
                abbreviatedType = residentialType?.description.substring(0, 5) + '.'
            }
            if ((unit as CommercialType)?.fk_lookup_type_of_commercial) {
                const commercialType = typeOfCommecial?.find(
                    type => type.id === (unit as CommercialType)?.fk_lookup_type_of_commercial
                )
                abbreviatedType = commercialType?.description.substring(0, 5) + '.'
            }

            return {
                fk_uhab: unit.id,
                fk_ideal_fraction: fraction?.fk_ideal_fraction || '',
                percentage: percentage,
                uhab_name: `${abbreviatedType} ${unit.name}`,
                uhab_grouping: unit.residential_grouping || unit.commercial_grouping || '',
                id: fraction?.id || `fraction-uhab-${unit.id}`
            }
        }) || [];

    const handleSave = (data: IdealFractionType) => {
        const itemsToUpdate = fractionList.map(item => {
            return {
                fk_ideal_fraction: idealFractionQuery.data?.id || item.fk_ideal_fraction,
                fk_uhab: item.fk_uhab,
                percentage: Number(item.percentage),
                id: item.id.includes('fraction-uhab-') ? undefined : item.id
            } as UhabIdealFractionType & { id?: string }
        })

        return updateIdealFractionMutation.mutateAsync({
            ideal_fraction: { ...idealFractionQuery.data, ...data, is_main: isMain },
            items: itemsToUpdate
        })
    }

    useEffect(() => {
        if (fractionList.find(item => Number(item.percentage) === 100.0)) {
            setDisableSaveButton(true)
        } else {
            setDisableSaveButton(false)
        }
    }, [fractionList])

    const disabledPercentField =
        idealFractionQuery.data?.distribution_type === DistributionType.EQUAL_DISTRIBUTION_PER_UNIT

    const sugestions = [
        ...new Set(
            ([] as string[])
                .concat(items.filter(item => Number(item.percentage) > 0).map(i => i.percentage))
                .concat(
                    uhabIdealFractionQuery.data
                        ?.filter(item => Number(item.percentage) > 0)
                        .map(i => Number(i.percentage).toFixed(5)) || []
                )
                .map(item => Number(item).toFixed(5))
                .sort((a, b) => Number(a) - Number(b))
        )
    ]

    return (
        <Card>
            <Box>
                <Box sx={{ p: 4, paddingTop: 8, display: 'grid', gap: 4 }}>
                    <TextField
                        control={control}
                        label='Nome'
                        name='description'
                        rules={{ required: 'Campo obrigatório' }}
                        error={errors.description}
                        defaultValue=''
                        disabled={formDisabled}
                    />
                    <TextField
                        label='Tipo de Distribuição'
                        name='distribution_type'
                        value={
                            idealFractionQuery.data?.distribution_type == DistributionType.MANUAL_DISTRIBUTION
                                ? 'Distribuição Manual'
                                : 'Distribuição Igual por Unidade'
                        }
                        disabled={true}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl>
                            <ConfirmationDialog
                                onConfirm={() => {
                                    setIsMain(true)
                                }}
                                onReject={() => {
                                    setIsMain(false)
                                }}
                                title='Atribuir como principal'
                                subTitle='Atribuir como principal'
                                content='Atribuir como principal, qualquer fração ideal anteriormente marcada como principal será desmarcada.'
                                render={confirm => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disabled={formDisabled || idealFractionQuery.data?.is_main}
                                                checked={isMain}
                                                value={isMain}
                                                onChange={event => {
                                                    if (event.target.checked) {
                                                        confirm(undefined)
                                                    } else {
                                                        setIsMain(false)
                                                    }
                                                    setIsActivated(false)
                                                }}
                                            />
                                        }
                                        label='Principal'
                                        labelPlacement='end'
                                        value={isMain}
                                    />
                                )}
                            />
                        </FormControl>
                        <Chip
                            label={isActivated ? 'Ativo' : 'Inativo'}
                            color={isActivated ? 'primary' : 'default'}
                            sx={{ alignSelf: 'center' }}
                        />
                    </Box>
                    <Box sx={{ mb: 8 }}>
                        {disableSaveButton && (
                            <Alert severity='error'>
                                <AlertTitle>Ação não permitida!</AlertTitle>
                                {`Não é possível salvar a fração ideal quando apenas uma unidade possui 100% da distribuição.`}
                            </Alert>
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
                        '& .DataGrid-cell--editable': {
                            position: 'relative',
                            backgroundColor: '#d5d5d51a'
                        },
                        '.MuiDataGrid-row > div:nth-child(2)': {
                            color: formDisabled ? '#898989' : 'inherit'
                        },
                        'div[role="presentation"].MuiAutocomplete-popper': {
                            zIndex: 1000000
                        }
                    }}
                >
                    <Table
                        data={fractionList}
                        disablePagination
                        defaultPageSize={fractionList.length}
                        disableRowSelectionOnClick
                        footerElement={TableFooter}
                        footerElementProps={{
                            total: fractionList.reduce((acc, item) => acc + Number(item.percentage), 0),
                            isActivated: isActivated
                        }}
                    >
                        <TableCell header='Incluso' field='actions'>
                            {({ row }: DataParams<IdealFractionItem>) => (
                                <Checkbox
                                    key={row.id}
                                    checked={Number(row.percentage) > 0}
                                    disabled={formDisabled}
                                    onChange={event => {
                                        setIsActivated(false)
                                        let newItems = items
                                        const defaultValue = Number(100 / fractionList.length).toFixed(5)
                                        if (items.find(item => item.id === row.id)) {
                                            newItems = items.map(item => {
                                                if (item.id === row.id) {
                                                    return {
                                                        ...item,
                                                        percentage: event.target.checked ? defaultValue : '0.00000'
                                                    }
                                                }
                                                return item
                                            })
                                        } else {
                                            newItems = [
                                                ...items,
                                                { ...row, percentage: event.target.checked ? defaultValue : '0.00000' }
                                            ]
                                        }

                                        setItems(newItems)
                                    }}
                                />
                            )}
                        </TableCell>
                        {condominium?.has_grouping && <TableCell header='Agrupamento' field='uhab_grouping' />}
                        <TableCell header='Unidade' field='uhab_name' />
                        <TableCell
                            header='Porcentagem'
                            field='percentage'
                            cellClassName='DataGrid-cell--editable'
                            width={150}
                        >
                            {({ row }: DataParams<IdealFractionItem>) =>
                                formDisabled || disabledPercentField ? (
                                    <MuiTextField
                                        sx={{
                                            position: 'absolute',
                                            top: '-3px',
                                            left: '-3px',
                                            bottom: '-3px',
                                            right: '-3px'
                                        }}
                                        fullWidth
                                        variant='outlined'
                                        disabled={formDisabled || disabledPercentField}
                                        value={row.percentage}
                                    />
                                ) : (
                                    <Autocomplete
                                        freeSolo
                                        value={row.percentage}
                                        onSelect={event => {
                                            const value = (event.target as any).value
                                            setIsActivated(false)
                                            let newItems = items
                                            if (items.find(item => item.id === row.id)) {
                                                newItems = items.map(item => {
                                                    if (item.id === row.id) {
                                                        return { ...item, percentage: value }
                                                    }
                                                    return item
                                                })
                                            } else {
                                                newItems = [...items, { ...row, percentage: value }]
                                            }
                                            setItems(newItems)
                                        }}
                                        onInputChange={(event, value) => {
                                            setIsActivated(false)
                                            let newItems = items
                                            if (items.find(item => item.id === row.id)) {
                                                newItems = items.map(item => {
                                                    if (item.id === row.id) {
                                                        return { ...item, percentage: value }
                                                    }
                                                    return item
                                                })
                                            } else {
                                                newItems = [...items, { ...row, percentage: value }]
                                            }
                                            setItems(newItems)
                                        }}
                                        onBlur={event => {
                                            let newItems = items
                                            if (items.find(item => item.id === row.id)) {
                                                newItems = items.map(item => {
                                                    if (item.id === row.id) {
                                                        return {
                                                            ...item,
                                                            percentage: Number((event.target as any).value).toFixed(5)
                                                        }
                                                    }
                                                    return item
                                                })
                                            }
                                            setItems(newItems)
                                        }}
                                        renderInput={params => (
                                            <MuiTextField
                                                {...params}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '-3px',
                                                    left: '-3px',
                                                    bottom: '-3px',
                                                    right: '-3px'
                                                }}
                                                fullWidth
                                                variant='outlined'
                                                disabled={formDisabled || disabledPercentField}
                                                value={row.percentage}
                                            />
                                        )}
                                        options={sugestions.map(item => ({ label: item }))}
                                    />
                                )
                            }
                        </TableCell>
                    </Table>
                </Box>
                <Box sx={{ p: 3.5 }}>
                    <Grid item xs={12}>
                        {formDisabled && (
                            <Button
                                variant='contained'
                                color='primary'
                                sx={{ marginRight: 3.5 }}
                                type='submit'
                                onClick={() => setFormDisabled(false)}
                            >
                                Habilitar Edição
                            </Button>
                        )}
                        {!formDisabled && (
                            <>
                                <SaveConfirmationDialogIdealFraction
                                    title='Atualizar Fração Ideal'
                                    subTitle='Altere essa fração ideal.'
                                    content='Esta ação irá alterar essa fração ideal e poderá influenciar em documentações em diversos módulos do sistema! Caso tenha certeza, clique em "Atualizar".'
                                    onConfirm={handleSave}
                                    data={{
                                        canActive:
                                            fractionList
                                                .reduce((acc, item) => acc + Number(item.percentage), 0)
                                                .toFixed(2)
                                                .toString() === '100.00'
                                    }}
                                    render={confirm => (
                                        <Button
                                            variant='contained'
                                            sx={{ marginRight: 3.5 }}
                                            type='submit'
                                            disabled={Object.keys(errors).length !== 0 || disableSaveButton}
                                            onClick={handleSubmit(confirm)}
                                        >
                                            Salvar Alterações
                                        </Button>
                                    )}
                                />

                                <Button
                                    variant='contained'
                                    color='error'
                                    type='submit'
                                    onClick={() => {
                                        setFormDisabled(true)
                                        setItems([])
                                        reset({
                                            description: idealFractionQuery.data?.description,
                                            is_main: idealFractionQuery.data?.is_main,
                                            activated_at: idealFractionQuery.data?.activated_at
                                        })
                                        setIsActivated(idealFractionQuery.data?.activated_at != null)
                                        setIsMain(idealFractionQuery.data?.is_main || false)
                                        setDisableSaveButton(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </Grid>
                </Box>
            </Box>
        </Card>
    )
}

type TableFooterProps = {
    total: number
    isActivated: boolean
}
function TableFooter({ total, isActivated }: TableFooterProps) {
    return (
        <Box display='flex' justifyContent='flex-end' sx={{ padding: 4, marginLeft: 'auto' }}>
            <TextField
                size='small'
                label='Total'
                value={total.toFixed(2)}
                variant='outlined'
                disabled
                helperText={
                    total.toFixed(2).toString() === '100.00'
                        ? isActivated
                            ? 'A fração ideal atingiu 100% de distribuição'
                            : 'A fração ideal atingiu 100% de distribuição e está pronta para ser ativada.'
                        : 'A ativação da fração ideal só será possível quando a soma total atingir 100%.'
                }
            />
        </Box>
    )
}
