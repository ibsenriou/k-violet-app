import DialogComponent from '@core/components/dialog'
import { Controller, useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import LoadingButton from '@core/components/loading-button'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import NewChargeTable from './components/table/NewChargeTable'

const chargeSchema = yup
    .object({
        due_date: yup.date().required('Campo obrigatório'),
        competence: yup.date().required('Campo obrigatório')
    })
    .required()
export type ChargeSchemaType = yup.InferType<typeof chargeSchema>

type NewCollectionProps = {
    onCancel: () => void
    onConfirm: () => void
}
function NewCollection({ onCancel, onConfirm }: NewCollectionProps) {
    const queryClient = useQueryClient()

    const chargeForm = useForm<ChargeSchemaType>({
        resolver: yupResolver(chargeSchema),
        defaultValues: {
            competence: moment().startOf('month')
        }
    })

    const collectionQuery = useQuery({
        queryKey: ['charge-collection', chargeForm.watch('competence')],
        queryFn: () =>
            FinancialService.charges_collections_by_competence.get(undefined, {
                competence: moment(chargeForm.watch('competence')).format('YYYYMM')
            }),
        select: response => response.data
    })

    const createCollectionMutation = useMutation({
        mutationFn: (chargeData: ChargeSchemaType) => {
            return FinancialService.charges_collections_by_competence.post(undefined, {
                hash: collectionQuery.data?.hash,
                competence: parseInt(moment(chargeData.competence).format('YYYYMM')),
                due_date: moment(chargeData.due_date).format('YYYY-MM-DD')
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['charges']
            })
            onConfirm()
        }
    })

    return (
        <DialogComponent title='Gerar Cobranças' description='Gerar cobracas para esse condominio' onClose={onCancel}>
            <DialogContent>
                <Box display='grid' gap='8px'>
                    <Box display='flex' gap='8px'>
                        <Controller
                            name='due_date'
                            control={chargeForm.control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        onChange={date => field.onChange(date)}
                                        value={moment(field.value)}
                                        label='Data de Vencimento'
                                        slotProps={{
                                            textField: {
                                                error: !!chargeForm.formState.errors.due_date,
                                                helperText: chargeForm.formState.errors.due_date?.message
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Controller
                            name='competence'
                            control={chargeForm.control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        onChange={date => field.onChange(date)}
                                        value={moment(field.value)}
                                        label='Competência'
                                        views={['month', 'year']}
                                        format='MM/YYYY'
                                        slotProps={{
                                            textField: {
                                                error: !!chargeForm.formState.errors.competence,
                                                helperText: chargeForm.formState.errors.competence?.message
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Box>
                    <NewChargeTable collections={collectionQuery.data?.data || []} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button disabled={createCollectionMutation.isPending} onClick={onCancel}>
                    Cancelar
                </Button>
                <LoadingButton
                    variant='contained'
                    loading={createCollectionMutation.isPending}
                    onClick={chargeForm.handleSubmit(data => createCollectionMutation.mutate(data))}
                >
                    Gerar
                </LoadingButton>
            </DialogActions>
        </DialogComponent>
    )
}

export default NewCollection
