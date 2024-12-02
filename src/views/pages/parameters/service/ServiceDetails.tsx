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

import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'
import SelectField from '@core/components/inputs/SelectField'
import { AccountingService } from 'src/services/accountingService'

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    description: yup.string().nullable()
})

type ServiceDetailsProps = {
    disabledAllFields?: boolean
    service?: ServiceType
    onConfirm?: () => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function ServiceDetails({
    disabledAllFields,
    service,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: ServiceDetailsProps) {
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<ServiceType>({
        defaultValues: service,
        resolver: yupResolver(schema)
    })

    const { error } = useSnackbar()

    const queryClient = useQueryClient()

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(response => response.data)
        },
        select: data => data.results.filter(i => i.code.startsWith('4.1.1.3.')),
        staleTime: 1000 * 60 * 5
    })

    const mutation = useMutation({
        mutationFn: async (data: ServiceType) => serviceAction?.(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] })
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
                    <TextField
                        label='Descrição'
                        disabled={disabledAllFields}
                        name='description'
                        control={control}
                        error={errors.description}
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
