import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useSnackbar from 'src/hooks/useSnackbar'

import LoadingButton from '@core/components/loading-button'
import TextField from '@core/components/inputs/TextField'
import SelectField from '@core/components/inputs/SelectField'

import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'

import { CoreService } from 'src/services/coreService'
import { AccountingService } from 'src/services/accountingService'

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    fk_measurement_unit: yup.string().required('Unidade de Medida é obrigatório')
})

type ProductDetailsProps = {
    disabledAllFields?: boolean
    product?: ProductType
    onConfirm?: () => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function ProductDetails({
    disabledAllFields,
    product,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: ProductDetailsProps) {
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<ProductType>({
        defaultValues: product,
        resolver: yupResolver(schema)
    })

    const { error } = useSnackbar()

    const queryClient = useQueryClient()

    const lookupUnitOfMeasurementQuery = useQuery({
        queryKey: ['measurementUnit'],
        queryFn: () => CoreService.measurementUnit.get().then(response => response.data),
        staleTime: 1000 * 60 * 5
    })



    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(response => response.data)
        },
        select: data =>
            data.results
                .filter(i => i.code.startsWith('4.1.1.2.'))
                .map(i => ({
                    ...i,
                    description: i.description
                        .replace('Despesas C/ Materiais de', '')
                        .replace('Despesas C/ Materiais', '')
                        .replace('Despesas C/', '')
                        .trim()
                })),
        staleTime: 1000 * 60 * 5
    })

    const mutation = useMutation({
        mutationFn: async (data: ProductType) => serviceAction?.(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            onConfirm?.()
        },
        onError: () => {
            error('Erro ao processar os dados. Tente novamente mais tarde.')
        }
    })

    return (
        <>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <Grid container gap={4} pt={1}>
                    <TextField
                        label='Nome'
                        disabled={disabledAllFields}
                        name='name'
                        control={control}
                        error={errors.name}
                    />
                    <SelectField
                        label='Unidade de Medida'
                        disabled={disabledAllFields}
                        name='fk_measurement_unit'
                        control={control}
                        keyLabel='label'
                        keyValue='value'
                        error={errors.fk_measurement_unit}
                        items={
                            lookupUnitOfMeasurementQuery.data?.results.map(item => ({
                                label: item.description,
                                value: item.id
                            })) || []
                        }
                    />
                    <SelectField
                        label='Categoria'
                        disabled={disabledAllFields}
                        name='fk_account'
                        control={control}
                        keyLabel='label'
                        keyValue='value'
                        error={errors.fk_account}
                        items={
                            accountQuery.data?.map(item => ({
                                label: item.description,
                                value: item.id
                            })) || []
                        }
                    />
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                {serviceAction && (
                    <LoadingButton
                        variant='contained'
                        type='submit'
                        sx={{ marginRight: 1 }}
                        loading={Boolean(mutation?.isPending)}
                        onClick={handleSubmit(data => mutation?.mutate(data))}
                        color={onConfirmColor || 'primary'}
                    >
                        {onConfirmLabel || 'Salvar'}
                    </LoadingButton>
                )}
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Cancelar
                </Button>
            </DialogActions>
        </>
    )
}
