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

import { ReadingItemType } from '@typesApiMapping/apps/condominium/ReadingItemTypes'

import { CoreService } from 'src/services/coreService'

const schema = yup.object().shape({
    description: yup.string().required('Nome é obrigatório'),
    fk_measurement_unit: yup.string().required('Unidade de Medida é obrigatório'),
    amount: yup.number().required('Preço é obrigatório')
})

type ReadingItemDetailsProps = {
    disabledAllFields?: boolean
    readingItem?: ReadingItemType
    onConfirm?: () => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function ReadingItemDetails({
    disabledAllFields,
    readingItem: readingItem,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: ReadingItemDetailsProps) {
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<ReadingItemType>({
        defaultValues: readingItem,
        resolver: yupResolver(schema)
    })

    const { error } = useSnackbar()

    const queryClient = useQueryClient()

    const lookupUnitOfMeasurementQuery = useQuery({
        queryKey: ['measurementUnit'],
        queryFn: () => CoreService.measurementUnit.get().then(response => response.data),
        staleTime: 1000 * 60 * 5
    })

    const mutation = useMutation({
        mutationFn: async (data: ReadingItemType) => {
            // Ensure the amount field has a valid value before sending it to the backend
            if (!data.amount) {
                throw new Error('Amount is required')
            }
            // Call the service action with the correct data
            return serviceAction?.({ ...data })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reading_item'] })
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
                        name='description'
                        control={control}
                        error={errors.description}
                    />
                    <SelectField
                        label='Unidade de Medida'
                        disabled={disabledAllFields}
                        name='fk_measurement_unit'
                        control={control}
                        keyLabel='description'
                        keyValue='id'
                        error={errors.fk_measurement_unit}
                        items={
                            lookupUnitOfMeasurementQuery.data?.results.map(item => ({
                                description: item.description,
                                id: item.id
                            })) || []
                        }
                    />
                    <TextField
                        label='Preço'
                        disabled={disabledAllFields}
                        name='amount'
                        control={control}
                        error={errors.amount}
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
