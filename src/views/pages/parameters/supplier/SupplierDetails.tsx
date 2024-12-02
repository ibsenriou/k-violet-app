import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import useSnackbar from 'src/hooks/useSnackbar'

import LoadingButton from '@core/components/loading-button'
import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import {
    addCNPJMask,
    addCPFMask,
    getCPFOrCNPJValidationError
} from '@core/utils/validate-national_individual_taxpayer_identification'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { CondominiumService } from 'src/services/condominiumService'

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('E-mail inválido').nullable(),
    cell_phone_number: yup.string().nullable(),
    identification: yup
        .string()
        .required('Este campo é obrigatório!')
        .test('validate-erros', 'CPF ou CNPJ inválidos', (value, { createError }) => {
            const message = getCPFOrCNPJValidationError(value ?? '')

            return message ? createError({ message }) : true
        })
})

const defaultSupplier: Partial<SupplierType> = {
    identification: '',
    name: '',
    email: '',
    cell_phone_number: ''
}

type SupplierDetailsProps = {
    disabledAllFields: boolean
    setDisableSaveButton?: (value: boolean) => void
    supplier?: SupplierType
    onConfirm?: (supplierId: string) => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function SupplierDetails({
    disabledAllFields,
    setDisableSaveButton,
    supplier,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: SupplierDetailsProps) {
    const [identificationSearch, setIdentificationSearch] = useState<string>('')
    const {
        control,
        watch,
        formState: { errors },
        getValues,
        setValue,
        handleSubmit
    } = useForm<SupplierType>({
        defaultValues: { ...defaultSupplier, ...supplier },
        resolver: yupResolver(schema)
    })

    const identificationLength = watch('identification')?.replace(/\D/g, '')?.length ?? 0

    const { error } = useSnackbar()

    const searchCPFOrCNPJ = useQuery({
        queryKey: ['supplier', identificationSearch],
        queryFn: async () =>
            CondominiumService.get_supplier_by_identification.get({
                identification: identificationSearch.replace(/\D/g, '')
            }),
        select: response => response.data,
        enabled: supplier === undefined && identificationLength >= 11
    })

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (data: SupplierType) =>
            serviceAction?.({
                ...data,
                fk_person: searchCPFOrCNPJ.data?.id || null,
                identification: data.identification.replace(/\D/g, '')
            }),
        onSuccess: createdSupplier => {
            queryClient.invalidateQueries({ queryKey: ['supplier'] })
            onConfirm?.(createdSupplier.id)
        },
        onError: () => {
            error('Erro ao processar os dados. Tente novamente mais tarde.')
        }
    })

    useEffect(() => {
        if (searchCPFOrCNPJ.data) {
            const supplier = searchCPFOrCNPJ.data
            if (supplier) {
                const { name, email, cell_phone_number } = supplier
                const identification = supplier.identification
                    ? addCPFMask(supplier.identification)
                    : addCNPJMask(supplier.identification)
                setValue('identification', identification)

                setValue('name', name)
                setValue('email', email)
                setValue('cell_phone_number', cell_phone_number)
            }
        }

        setDisableSaveButton?.(Boolean(searchCPFOrCNPJ.data?.is_supplier))
    }, [searchCPFOrCNPJ.data])

    useEffect(() => {
        if (supplier) {
            const identification = supplier.identification
                ? addCPFMask(supplier.identification)
                : addCNPJMask(supplier.identification)
            setValue('identification', identification)
        }
    }, [supplier])

    const _disableFields = Boolean(searchCPFOrCNPJ.data?.id)

    return (
        <>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'success'}
                                sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
                            >
                                {getInitials(watch('name') || '')}
                            </CustomAvatar>
                        </Box>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='identification'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputMask
                                        mask={value?.length < 15 ? '999.999.999-999' : '99.999.999/9999-99'}
                                        maskChar=''
                                        value={value}
                                        onChange={onChange}
                                        onBlur={() => {
                                            if (errors.identification) return
                                            setIdentificationSearch(getValues('identification'))
                                        }}
                                        disabled={disabledAllFields}
                                    >
                                        {() => (
                                            <TextField
                                                label='CPF ou CNPJ'
                                                autoFocus={true}
                                                disabled={disabledAllFields}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                        </FormControl>
                        {errors.identification && (
                            <FormHelperText error>{errors.identification.message}</FormHelperText>
                        )}
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label={identificationLength <= 11 ? 'Nome' : 'Nome da Empresa'}
                                        onChange={onChange}
                                        disabled={disabledAllFields || _disableFields || identificationLength < 11}
                                    />
                                )}
                            />
                        </FormControl>
                        {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='email'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        type='email'
                                        label='E-mail'
                                        value={value}
                                        onChange={onChange}
                                        disabled={disabledAllFields || _disableFields || identificationLength < 11}
                                    />
                                )}
                            />
                        </FormControl>
                        {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='cell_phone_number'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputMask
                                        mask='(99) 9 9999-9999'
                                        maskChar=''
                                        value={value || ''}
                                        onChange={onChange}
                                        disabled={disabledAllFields || _disableFields || identificationLength < 11}
                                    >
                                        {() => (
                                            <TextField
                                                label='Telefone Celular'
                                                placeholder='11 999999999'
                                                disabled={
                                                    disabledAllFields || _disableFields || identificationLength < 11
                                                }
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                            {errors.cell_phone_number && (
                                <FormHelperText error>{errors.cell_phone_number.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
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
                        disabled={Boolean(searchCPFOrCNPJ.data?.is_supplier)}
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
