import DialogComponent from '@core/components/dialog'
import Stepper from '@core/components/stepper'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useQuery } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import InfoDataDetails from './components/viewSteps/InfoDataDetails'
import ApportionmentDetails from './components/viewSteps/ApportionmentDetails'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'

type ViewCollectionProps = {
    onClose: () => void
    collectionId?: string
}
function ViewCollection({ onClose, collectionId }: ViewCollectionProps) {
    const collectionQuery = useQuery({
        queryKey: ['collection'],
        queryFn: () => FinancialService.collections.get(),
        select: response =>
            response.data.find((collection: CollectionType) => collection.id === collectionId) as CollectionType
    })

    const { nextLabel, prevLabel, nextStep, prevStep } = Stepper.useController({
        finishLabel: 'Fechar',
        cancelLabel: 'Fechar',
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        onCancel: onClose,
        onFinish: onClose
    })

    if (collectionQuery.isLoading) return null
    if (collectionQuery.data === undefined) return null

    return (
        <DialogComponent title='Arrecadação' description='' onClose={onClose}>
            <DialogContent>
                <Stepper.Container>
                    <Stepper.Step id='info' title='Informações'>
                        <InfoDataDetails collection={collectionQuery.data} />
                    </Stepper.Step>
                    <Stepper.Step id='installments' title='Parcelas'>
                        <ApportionmentDetails collection={collectionQuery.data} />
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

export default Stepper.connect(ViewCollection)
