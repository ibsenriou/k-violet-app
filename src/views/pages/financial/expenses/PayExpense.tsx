import DialogComponent from '@core/components/dialog'
import SelectField from '@core/components/inputs/SelectField'
import LoadingButton from '@core/components/loading-button'
import formatter from '@core/utils/formatter'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import moment from 'moment'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FinancialService } from 'src/services/financialService'
import * as yup from 'yup'
import { ExpenseFormat, PaymentMethodsOptions } from './enums'

const date = formatter('date')
const currency = formatter('currency')

const payExpenseSchema = yup.object({
    fk_bank_account: yup.string().required('Campo obrigatório'),
    payment_method: yup.string().required('Campo obrigatório'),
    payment_date: yup.date().required('Campo obrigatório'),
    interest: yup.number().required('Campo obrigatório'),
    discount: yup.number().required('Campo obrigatório'),
    fines: yup.number().required('Campo obrigatório')
})

export type PayExpenseSchemaType = yup.InferType<typeof payExpenseSchema>

type PayExpenseProps = {
    onCancel: () => void
    onConfirm: () => void
}

function PayExpense({ onCancel, onConfirm }: PayExpenseProps) {
    const queryClient = useQueryClient()

    const router = useRouter()
    const expenseId = router.query.expenseId as string

    const {
        control,
        watch,
        formState: { errors },
        handleSubmit
    } = useForm<PayExpenseSchemaType>({
        resolver: yupResolver(payExpenseSchema),
        defaultValues: {
            fk_bank_account: '',
            payment_method: '',
            interest: 0,
            discount: 0,
            fines: 0,
            payment_date: new Date()
        }
    })

    const expenseQuery = useQuery({
        queryKey: ['expense', expenseId],
        queryFn: () => FinancialService.expense_id.get({ expenseId: expenseId }),
        select: response => response.data
    })

    const bankAccountsQuery = useQuery({
        queryKey: ['bank-accounts'],
        queryFn: () => FinancialService.bank_accounts.get(),
        select: response => response.data.results
    })

    const createPaymentMutation = useMutation({
        mutationFn: (payExpenseData: PayExpenseSchemaType) => {
            return FinancialService.expenses_id_pay.post({ expenseId: expenseId }, payExpenseData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['expense']
            })
            onConfirm()
        }
    })

    const expense = expenseQuery.data

    const interest = watch('interest')
    const discount = watch('discount')
    const fines = watch('fines')

    if (!expense) {
        return null
    }

    const calculateFinalAmount = () => {
        const originalAmount = expense.amount

        const interestAmount = originalAmount * (interest / 100)
        const discountAmount = originalAmount * (discount / 100)
        const fineAmount = originalAmount * (fines / 100)

        return originalAmount + interestAmount - discountAmount + fineAmount
    }

    const writeExpenseDetailsMessage = (expense: ExpenseType) => {
      const expenseMessages = {
          [ExpenseFormat.unique]: `${expense.description}`,
          [ExpenseFormat.recurrent]: `${expense.description} - Recorrência ${expense.recurrence_index} de ${expense.recurrence_value}`,
          [ExpenseFormat.installments]: `${expense.description} - Parcela ${expense.recurrence_index} de ${expense.recurrence_value}`
      }

      return expenseMessages[expense.expense_format_label] || 'Erro ao buscar detalhes da despesa'
  }


    return (
        <DialogComponent title='Pagar Despesa' description={writeExpenseDetailsMessage(expense)} onClose={onCancel}>
            <DialogContent>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <SelectField
                            label='Conta do Pagamento'
                            name='fk_bank_account'
                            control={control}
                            keyLabel='label'
                            keyValue='value'
                            error={errors.fk_bank_account}
                            items={
                                bankAccountsQuery.data?.map((item: { name: any; id: any }) => ({
                                    label: item.name,
                                    value: item.id
                                })) || []
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SelectField
                            label='Forma de Pagamento'
                            name='payment_method'
                            control={control}
                            keyLabel='label'
                            keyValue='value'
                            error={errors.payment_method}
                            items={Object.entries(PaymentMethodsOptions).map(([key, value]) => ({
                                label: value,
                                value: key
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='payment_date'
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        onChange={date => field.onChange(date)}
                                        value={moment(field.value)}
                                        label='Data de Pagamento'
                                        views={['day', 'month', 'year']}
                                        format='DD/MM/YYYY'
                                        slotProps={{
                                            textField: {
                                                error: !!errors.payment_date,
                                                helperText: errors.payment_date?.message
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='interest'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    type='number'
                                    {...field}
                                    label='Juros'
                                    fullWidth
                                    error={!!errors.interest}
                                    helperText={errors.interest?.message}
                                    InputProps={{
                                        endAdornment: '%'
                                    }}
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='fines'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Multa'
                                    fullWidth
                                    error={!!errors.fines}
                                    helperText={errors.fines?.message}
                                    InputProps={{
                                        endAdornment: '%'
                                    }}
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='discount'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Desconto'
                                    fullWidth
                                    error={!!errors.discount}
                                    helperText={errors.discount?.message}
                                    InputProps={{
                                        endAdornment: '%'
                                    }}
                                    sx={{
                                        '& input': {
                                            textAlign: 'right'
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Divider
                        sx={{
                            width: '100%',
                            margin: '1rem 0'
                        }}
                    />

                    <Grid item xs={12} sm={4}>
                        <TextField disabled label='Data de Vencimento' value={date(expense.due_date)} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField disabled label='Valor Original' value={currency(expense.amount)} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField disabled label='Valor Final' value={currency(calculateFinalAmount())} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <Button disabled={createPaymentMutation.isPending} onClick={onCancel}>
                    Cancelar
                </Button>
                <LoadingButton
                    variant='contained'
                    loading={createPaymentMutation.isPending}
                    onClick={handleSubmit(data => createPaymentMutation.mutate(data))}
                >
                    Pagar
                </LoadingButton>
            </DialogActions>
        </DialogComponent>
    )
}

export default PayExpense
