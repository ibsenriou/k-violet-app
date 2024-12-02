import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'

import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useSnackbar from 'src/hooks/useSnackbar'

import SelectField from '@core/components/inputs/SelectField'
import TextField from '@core/components/inputs/TextField'
import LoadingButton from '@core/components/loading-button'

import { BankAccountType } from '@typesApiMapping/apps/financial/bankAccountTypes'
import { CoreService } from 'src/services/coreService'
import { LookupsService } from 'src/services/lookupsService'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { FinancialService } from 'src/services/financialService'

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    description: yup.string().required('Descrição é obrigatório'),
    account_agency: yup.string().required('Agência é obrigatório').max(4, 'Agência deve ter no máximo 4 dígitos'),
    account_number: yup
        .string()
        .required('Número da Conta é obrigatório')
        .max(12, 'Número da Conta deve ter no máximo 12 dígitos'),
    account_number_digit: yup
        .string()
        .required('Dígito da Conta é obrigatório')
        .max(1, 'Dígito da Conta deve ter no máximo 1 dígito'),

    fk_bank: yup.string().required('Banco é obrigatório'),
    fk_lookup_type_of_bank_account: yup.string().required('Tipo de Conta Bancária é obrigatório'),
    is_main_account: yup.boolean().required('Conta Principal é obrigatório').default(false)
})

type BankAccountDetailsProps = {
    disabledAllFields?: boolean
    bankAccount?: BankAccountType
    onConfirm?: () => void
    serviceAction?: (data: any) => Promise<any>
    onCancel: () => void
    onConfirmLabel?: string
    onConfirmColor?: 'primary' | 'error'
}

export default function BankAccountDetails({
    disabledAllFields,
    bankAccount,
    onCancel,
    serviceAction,
    onConfirm,
    onConfirmLabel,
    onConfirmColor
}: BankAccountDetailsProps) {
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<BankAccountType>({
        defaultValues: bankAccount,
        resolver: yupResolver(schema)
    })

    const { error } = useSnackbar()

    const queryClient = useQueryClient()

    const lookupTypeOfBankAccountQuery = useQuery({
        queryKey: ['lookupTypeOfBankAccount'],
        queryFn: () => LookupsService.lookup_type_of_bank_account.get().then(response => response.data),
        staleTime: 1000 * 60 * 5
    })

    const bankQuery = useQuery({
        queryKey: ['banks'],
        queryFn: () => CoreService.bank.get().then(response => response.data),
        staleTime: 1000 * 60 * 5
    })

    const bankAccountQuery = useQuery({
        queryKey: ['bankAccounts'],
        queryFn: () => FinancialService.bank_accounts.get().then(response => response.data),
        select: response => response.results,
        staleTime: 1000 * 60 * 5
    })

    const bankAccountsList: BankAccountType[] = bankAccountQuery.data

    const isMainAccountShouldBeDisabledBecauseAnotherMainAccountAlreadyExists = bankAccountsList?.some(
        bankAccount => bankAccount.is_main_account
    )

    const mutation = useMutation({
        mutationFn: async (data: BankAccountType) => serviceAction?.(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
            onConfirm?.()
        },
        onError: () => {
            error('Erro ao processar os dados. Tente novamente mais tarde.')
        }
    })

    return (
        <>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <Grid container spacing={4} pt={1}>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label='Nome'
                            disabled={disabledAllFields}
                            name='name'
                            control={control}
                            error={errors.name}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label='Descrição'
                            disabled={disabledAllFields}
                            name='description'
                            control={control}
                            error={errors.description}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label='Agência'
                            disabled={disabledAllFields}
                            name='account_agency'
                            control={control}
                            error={errors.account_agency}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            label='Número da Conta'
                            disabled={disabledAllFields}
                            name='account_number'
                            control={control}
                            error={errors.account_number}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label='Dígito da Conta'
                            disabled={disabledAllFields}
                            name='account_number_digit'
                            control={control}
                            error={errors.account_number_digit}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectField
                            label='Banco'
                            disabled={disabledAllFields}
                            name='fk_bank'
                            control={control}
                            keyLabel='label'
                            keyValue='value'
                            error={errors.fk_bank}
                            items={
                                bankQuery.data?.results.map(item => ({
                                    label: `${item.bank_code} - ${item.bank_name}`,
                                    value: item.id
                                })) || []
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectField
                            label='Tipo de Conta Bancária'
                            disabled={disabledAllFields}
                            name='fk_lookup_type_of_bank_account'
                            control={control}
                            keyLabel='label'
                            keyValue='value'
                            error={errors.fk_lookup_type_of_bank_account}
                            items={
                                lookupTypeOfBankAccountQuery.data?.results.map(item => ({
                                    label: item.description,
                                    value: item.id
                                })) || []
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl>
                            <Controller
                                name='is_main_account'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        value={field.value}
                                        checked={field.value}
                                        disabled={
                                            disabledAllFields ||
                                            isMainAccountShouldBeDisabledBecauseAnotherMainAccountAlreadyExists
                                        }
                                        label='Principal'
                                        labelPlacement='end'
                                    />
                                )}
                            />
                            <FormHelperText>Apenas uma conta bancária pode ser marcada como principal.</FormHelperText>
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
