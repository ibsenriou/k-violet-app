import DialogComponent from '@core/components/dialog'
import { FormProvider, useForm } from 'react-hook-form'

import Stepper from '@core/components/stepper'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import LoadingButton from '@core/components/loading-button'
import { ExpenseFormat, RecurrenceTypes } from './enums'

import ExpenseInformationDataForm from './components/steps/newSteps/ExpenseInformationDataForm'
import ExpenseProductsAndServicesDataForm from './components/steps/newSteps/ExpenseProductsAndServicesDataForm'
import ExpensePaymentDataForm from './components/steps/newSteps/ExpensePaymentDataForm'

const ExpenseInformationDataSchema = yup
    .object({
        fk_supplier: yup.string().required('Campo obrigatório'),
        description: yup.string().required('Campo obrigatório'),
        expense_type: yup.string().oneOf(['ordinary', 'extraordinary']).required('Campo obrigatório'),
        launch_date: yup.date().required('Campo obrigatório').typeError('Campo obrigatório'),
        due_date: yup.date().required('Campo obrigatório').typeError('Campo obrigatório'),
        expense_format: yup.string().oneOf(Object.keys(ExpenseFormat)).required('Campo obrigatório')
    })
    .required()

export type ExpenseInformationDataSchemaType = yup.InferType<typeof ExpenseInformationDataSchema>

const ExpenseProductsAndServicesSchema = yup.object({
    items: yup
        .array()
        .of(
            yup.object({
                fk_item: yup.string().required('Campo obrigatório'),
                amount: yup.number().required('Campo obrigatório'),
                quantity: yup.number().required('Campo obrigatório'),
                unit_amount: yup.number().required('Campo obrigatório'),
                type: yup.string().oneOf(['PRODUCT', 'SERVICE']).required('Campo obrigatório')
            })
        )
        .min(1, 'Campo obrigatório')
})

export type ExpenseProductsAndServicesSchemaType = yup.InferType<typeof ExpenseProductsAndServicesSchema>

const ExpenseSchema = yup
    .object({
        recurrence_type: yup.string().oneOf(Object.keys(RecurrenceTypes)).required('Campo obrigatório'),
        recurrence_value: yup.number().required('Campo obrigatório'),
        recurrence_initial_index: yup.number().min(1).required('Campo obrigatório'),
        amount: yup.number().required('Campo obrigatório'),
        fk_uhabs: yup.array().of(yup.string()).min(1, 'Campo obrigatório').required('Campo obrigatório'),
        fk_ideal_fraction: yup.string().required('Campo obrigatório')
    })
    .required()

export type ExpenseSchemaType = yup.InferType<typeof ExpenseSchema>

type NewExpenseProps = {
    onCancel: () => void
    onConfirm: () => void
}
function NewExpense({ onCancel, onConfirm }: NewExpenseProps) {
    const queryClient = useQueryClient()

    const expenseInformationDataFormSchema = useForm<ExpenseInformationDataSchemaType>({
        resolver: yupResolver(ExpenseInformationDataSchema),
        defaultValues: {
            launch_date: new Date(),
            due_date: new Date(),
            expense_format: ExpenseFormat.unique
        }
    })

    const expenseProductsAndServicesDataForm = useForm<ExpenseProductsAndServicesSchemaType>({
        resolver: yupResolver(ExpenseProductsAndServicesSchema),
        defaultValues: {
            items: []
        }
    })

    const ExpenseForm = useForm<ExpenseSchemaType>({
        resolver: yupResolver(ExpenseSchema),
        defaultValues: {
            recurrence_initial_index: 1,
            recurrence_value: 1
        }
    })

    const createExpenseMutation = useMutation({
        mutationFn: () => {
            const informationData = expenseInformationDataFormSchema.getValues()
            const productsAndServicesData = expenseProductsAndServicesDataForm.getValues()
            const paymentData = ExpenseForm.getValues()

            productsAndServicesData.items = productsAndServicesData?.items?.map(item => ({
                ...item,
                unit_amount: item.unit_amount * 100,
                amount: item.amount * 100
            }))

            return FinancialService.expenses.post([], {
                ...informationData,
                ...productsAndServicesData,
                ...paymentData
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['expense']
            })
            onConfirm()
        }
    })

    const { nextLabel, prevLabel, nextStep, prevStep } = Stepper.useController({
        finishLabel: 'Salvar',
        cancelLabel: 'Cancelar',
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        onCancel,
        onFinish: async () => {
            await createExpenseMutation.mutateAsync()
        }
    })

    useEffect(() => {
        if (expenseInformationDataFormSchema.watch('expense_format') == 'single') {
            ExpenseForm.setValue('recurrence_value', 1)
        }
    }, [ExpenseForm, expenseInformationDataFormSchema])

    return (
        <DialogComponent title='Adicionar Despesa' description='Insira uma despesa' onClose={onCancel}>
            <DialogContent>
                <Stepper.Container>
                    <Stepper.Step
                        id='Expenseinformation'
                        title='Informações'
                        formProvider={expenseInformationDataFormSchema}
                    >
                        <FormProvider {...expenseInformationDataFormSchema}>
                            <ExpenseInformationDataForm />
                        </FormProvider>
                    </Stepper.Step>
                    <Stepper.Step id='productsAndServices' title='Produtos e Serviços'>
                        <FormProvider {...expenseProductsAndServicesDataForm}>
                            <ExpenseProductsAndServicesDataForm />
                        </FormProvider>
                    </Stepper.Step>
                    <Stepper.Step id='paymentInformation' title='Dados de Pagamento'>
                        <FormProvider {...ExpenseForm}>
                            <ExpensePaymentDataForm
                                format={expenseInformationDataFormSchema.watch('expense_format') as ExpenseFormat}

                                // @ts-ignore
                                items={expenseProductsAndServicesDataForm.watch('items')}
                                launch_date={expenseInformationDataFormSchema.watch('launch_date')}
                                due_date={expenseInformationDataFormSchema.watch('due_date')}
                            />
                        </FormProvider>
                    </Stepper.Step>
                </Stepper.Container>
            </DialogContent>
            <DialogActions>
                <Button disabled={createExpenseMutation.isPending} onClick={prevStep}>
                    {prevLabel}
                </Button>
                <LoadingButton onClick={nextStep} variant='contained' loading={createExpenseMutation.isPending}>
                    {nextLabel}
                </LoadingButton>
            </DialogActions>
        </DialogComponent>
    )
}

export default Stepper.connect(NewExpense)
