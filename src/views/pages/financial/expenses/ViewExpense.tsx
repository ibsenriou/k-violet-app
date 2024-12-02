import DialogComponent from '@core/components/dialog'
import Stepper from '@core/components/stepper'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useQuery } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import ExpenseInformationDataForm from './components/steps/viewSteps/ExpenseInformationDataForm'
import ExpenseProductsAndServicesDataForm from './components/steps/viewSteps/ExpenseProductsAndServicesDataForm'
import ExpensePaymentDataForm from './components/steps/viewSteps/ExpensePaymentDataForm'

type ViewExpenseProps = {
    onClose: () => void
    expenseId?: string
}
function ViewExpense({ onClose, expenseId }: ViewExpenseProps) {
    const expenseQuery = useQuery({
        queryKey: ['expense'],
        queryFn: () => FinancialService.expenses.get(),
        select: response => response.data.find((expense: ExpenseType) => expense.id === expenseId) as ExpenseType
    })

    const { nextLabel, prevLabel, nextStep, prevStep } = Stepper.useController({
        finishLabel: 'Fechar',
        cancelLabel: 'Fechar',
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        onCancel: onClose,
        onFinish: onClose
    })

    if (expenseQuery.isLoading) return null
    if (expenseQuery.data === undefined) return null

    return (
        <DialogComponent title='Despesa' description='' onClose={onClose}>
            <DialogContent>
                <Stepper.Container>
                    <Stepper.Step id='expenseInformation' title='Informações'>
                        <ExpenseInformationDataForm expense={expenseQuery.data} />
                    </Stepper.Step>
                    <Stepper.Step id='expenseProductsAndServices' title='Produtos e Serviços'>
                        <ExpenseProductsAndServicesDataForm expense={expenseQuery.data} />
                    </Stepper.Step>
                    <Stepper.Step id='expensePayment' title='Dados de Pagamento'>
                        <ExpensePaymentDataForm expense={expenseQuery.data} />
                    </Stepper.Step>
                </Stepper.Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={prevStep}>{prevLabel}</Button>
                <Button onClick={nextStep} variant='contained'>
                    {nextLabel}
                </Button>
            </DialogActions>
        </DialogComponent>
    )
}

export default Stepper.connect(ViewExpense)
