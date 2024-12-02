import DialogComponent from '@core/components/dialog'
import Stepper from '@core/components/stepper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExpenseType } from '@typesApiMapping/apps/financial/expenseTypes'
import { useState } from 'react'
import { FinancialService } from 'src/services/financialService'
import ExpenseInformationDataForm from './components/steps/viewSteps/ExpenseInformationDataForm'
import ExpensePaymentDataForm from './components/steps/viewSteps/ExpensePaymentDataForm'
import ExpenseProductsAndServicesDataForm from './components/steps/viewSteps/ExpenseProductsAndServicesDataForm'
import Close from 'mdi-material-ui/Close'

type DeleteExpenseProps = {
    onClose: () => void
    expenseId?: string
}
function DeleteExpense({ onClose, expenseId }: DeleteExpenseProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const close = () => setDialogOpen(false)

    if (!expenseId) return null

    const queryClient = useQueryClient()

    const expenseQuery = useQuery({
        queryKey: ['expense'],
        queryFn: () => FinancialService.expenses.get(),
        select: response => response.data.find((expense: ExpenseType) => expense.id === expenseId) as ExpenseType
    })

    const deleteExpenseMutation = useMutation({
        mutationFn: () => FinancialService.expense_id.delete({ expenseId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['expense']
            })
            onClose()
        }
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
        <>
            <Dialog fullWidth open={dialogOpen} maxWidth='md' scroll='body' onClose={close} onBackdropClick={close}>
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton size='small' onClick={close} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
                        <Close />
                    </IconButton>

                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Excluir Despesa
                        </Typography>
                        <Typography variant='body2'>
                            Esta ação irá excluir permanentemente a despesa. Por favor, verifique se está absolutamente
                            certo disso antes de proceder!
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button variant='contained' color='error' onClick={() => deleteExpenseMutation.mutate()}>
                        Excluir
                    </Button>
                    <Button variant='contained' color='secondary' onClick={close}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>

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
                    <Box sx={{ width: '100%' }}>
                        <Button onClick={() => setDialogOpen(true)} variant='contained' color='error'>
                            Excluir Depsesa
                        </Button>
                    </Box>

                    <Button onClick={prevStep}>{prevLabel}</Button>
                    <Button onClick={nextStep} variant='contained'>
                        {nextLabel}
                    </Button>
                </DialogActions>
            </DialogComponent>
        </>
    )
}

export default Stepper.connect(DeleteExpense)
