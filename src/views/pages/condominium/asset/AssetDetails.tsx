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

import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { LookupsService } from 'src/services/lookupsService'

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    description: yup.string().required('Nome é obrigatório'),
    fk_lookup_type_of_asset_category: yup.string().required('Categoria de Ativo é obrigatório')
})

type AssetDetailsProps = {
    disabledAllFields?: boolean
    asset?: AssetType
    onConfirm?: () => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function AssetDetails({
    disabledAllFields,
    asset: asset,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: AssetDetailsProps) {
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<AssetType>({
        defaultValues: asset,
        resolver: yupResolver(schema)
    })

    const { error } = useSnackbar()

    const queryClient = useQueryClient()

    const lookupAssetCategoryQuery = useQuery({
        queryKey: ['lookup_type_of_asset_category'],
        queryFn: () => LookupsService.lookup_type_of_asset_category.get().then(response => response.data),
        staleTime: 1000 * 60 * 5
    })

    const mutation = useMutation({
        mutationFn: async (data: AssetType) => {
            // Ensure the asset field has a valid value before sending it to the backend
            if (!data.name) {
                throw new Error('Nome é necessário')
            }
            // Call the service action with the correct data
            return serviceAction?.({ ...data })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset'] })
            queryClient.invalidateQueries({ queryKey: ['asset', asset?.id] })
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
                    <SelectField
                        label='Categoria de Ativo'
                        disabled={disabledAllFields}
                        name='fk_lookup_type_of_asset_category'
                        control={control}
                        keyLabel='name'
                        keyValue='id'
                        error={errors.fk_lookup_type_of_asset_category}
                        items={
                            lookupAssetCategoryQuery.data?.results.map(item => ({
                                name: item.name,
                                id: item.id
                            })) || []
                        }
                    />

                    <TextField
                        label='Nome'
                        disabled={disabledAllFields}
                        name='name'
                        control={control}
                        error={errors.name}
                    />

                    <TextField
                        label='Descrição'
                        disabled={disabledAllFields}
                        name='description'
                        control={control}
                        error={errors.description}
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
