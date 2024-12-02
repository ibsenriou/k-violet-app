import DialogComponent from '@core/components/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import InfoDataForm from './components/newSteps/InfoDataForm'
import Stepper from '@core/components/stepper'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import ApportionmentInfo from './components/newSteps/Apportionment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import LoadingButton from '@core/components/loading-button'
import { CollectionFormat, CollectionTypes, RecurrenceTypes } from './enums'

const InfoDataSchema = yup
    .object({
        fk_account: yup.string().required('Campo obrigatório'),
        competence: yup.date().required('Campo obrigatório'),
        responsible: yup.string().oneOf(['proprietary', 'resident']).required('Campo obrigatório'),
        nature: yup.string().oneOf(['ordinary', 'extraordinary']).required('Campo obrigatório'),
        amount: yup.number().required('Campo obrigatório'),
        description: yup.string().required('Campo obrigatório'),
        type: yup.string().oneOf(Object.keys(CollectionTypes)).required('Campo obrigatório'),
        format: yup.string().oneOf(Object.keys(CollectionFormat)).required('Campo obrigatório')
    })
    .required()
export type InfoDataSchemaType = yup.InferType<typeof InfoDataSchema>

const ApportionmentSchema = yup
    .object({
        recurrence_type: yup.string().oneOf(Object.keys(RecurrenceTypes)).required('Campo obrigatório'),
        recurrence_value: yup.number().required('Campo obrigatório'),
        recurrence_initial_index: yup.number().min(1).required('Campo obrigatório'),
        amount: yup.number().required('Campo obrigatório'),
        fk_uhabs: yup.array().of(yup.string()).min(1, 'Campo obrigatório').required('Campo obrigatório'),
        fk_ideal_fraction: yup.string().required('Campo obrigatório')
    })
    .required()
export type ApportionmentSchemaType = yup.InferType<typeof ApportionmentSchema>

type NewCollectionProps = {
    onCancel: () => void
    onConfirm: () => void
}
function NewCollection({ onCancel, onConfirm }: NewCollectionProps) {
    const queryClient = useQueryClient()

    const infoDataForm = useForm<InfoDataSchemaType>({
        resolver: yupResolver(InfoDataSchema),
        defaultValues: {
            competence: moment().startOf('month')
        }
    })
    const apportionmentForm = useForm<ApportionmentSchemaType>({
        resolver: yupResolver(ApportionmentSchema),
        defaultValues: {
            recurrence_initial_index: 1,
            recurrence_value: 1
        }
    })

    const createCollectionMutation = useMutation({
        mutationFn: () => {
            const infoData = infoDataForm.getValues()
            const apportionmentData = apportionmentForm.getValues()
            return FinancialService.collections.post(null, {
                ...infoData,
                ...apportionmentData
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['collection']
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
            await createCollectionMutation.mutateAsync()
        }
    })

    useEffect(() => {
        apportionmentForm.setValue('amount', infoDataForm.watch('amount'))
    }, [infoDataForm.watch('amount')])

    useEffect(() => {
        infoDataForm.setValue('amount', apportionmentForm.watch('amount'))
    }, [apportionmentForm.watch('amount')])

    useEffect(() => {
        if (infoDataForm.watch('format') == 'single') {
            apportionmentForm.setValue('recurrence_value', 1)
        }
    }, [infoDataForm.watch('format')])

    return (
        <DialogComponent title='Adicionar Arrecadação' description='Inseria uma arrecadação' onClose={onCancel}>
            <DialogContent>
                <Stepper.Container>
                    <Stepper.Step id='info' title='Informações' formProvider={infoDataForm}>
                        <FormProvider {...infoDataForm}>
                            <InfoDataForm />
                        </FormProvider>
                    </Stepper.Step>
                    <Stepper.Step id='installments' title='Parcelas'>
                        <FormProvider {...apportionmentForm}>
                            <ApportionmentInfo
                                format={infoDataForm.watch('format') as CollectionFormat}
                                type={infoDataForm.watch('type') as CollectionTypes}
                                competence={moment(infoDataForm.watch('competence'))}
                            />
                        </FormProvider>
                    </Stepper.Step>
                </Stepper.Container>
            </DialogContent>
            <DialogActions>
                <Button disabled={createCollectionMutation.isPending} onClick={prevStep}>
                    {prevLabel}
                </Button>
                <LoadingButton onClick={nextStep} variant='contained' loading={createCollectionMutation.isPending}>
                    {nextLabel}
                </LoadingButton>
            </DialogActions>
        </DialogComponent>
    )
}

export default Stepper.connect(NewCollection)
