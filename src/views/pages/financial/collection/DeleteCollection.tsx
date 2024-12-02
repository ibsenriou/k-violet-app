import DialogComponent from '@core/components/dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import type { Theme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FinancialService } from 'src/services/financialService'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'
import LoadingButton from '@core/components/loading-button'
import { CollectionFormat } from './enums'

type DeleteCollectionProps = {
    onClose: () => void
    collectionId: string
}
function DeleteCollection({ onClose, collectionId }: DeleteCollectionProps) {
    const queryClient = useQueryClient()

    const collectionQuery = useQuery({
        queryKey: ['collection'],
        queryFn: () => FinancialService.collections.get(),
        select: response =>
            response.data.find((collection: CollectionType) => collection.id === collectionId) as CollectionType
    })

    const deleteCollectionMutation = useMutation({
        mutationFn: () => {
            return FinancialService.collection_id.delete({ collectionId, multiple: false })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['collection']
            })
            onClose()
        }
    })

    const deleteMultiplesCollectionMutation = useMutation({
        mutationFn: () => {
            return FinancialService.collection_id.delete({ collectionId, multiple: true })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['collection']
            })
            onClose()
        }
    })

    if (collectionQuery.isLoading) return null
    if (collectionQuery.data === undefined) return null

    const collection = collectionQuery.data

    return (
        <DialogComponent title='Deletar Arrecadação' description='' onClose={onClose}>
            <DialogContent>
                <Box display='grid' gap='16px'>
                    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='16px'>
                        <TextField label='Categoria' value={collection.account_description} disabled />
                        <TextField label='Competência' value={collection.competence} disabled />
                        <TextField
                            label='Responsável'
                            name='responsible'
                            disabled
                            value={collection.responsible == 'resident' ? 'Morador/Locatário' : 'Proprietário'}
                            helperText={
                                collection.responsible == 'resident'
                                    ? 'Caso o morador/locatário não esteja cadastrado, será gerado a cobrança para o proprietário.'
                                    : ''
                            }
                        />

                        <TextField
                            label='Natureza'
                            name='nature'
                            disabled
                            value={collection.nature == 'ordinary' ? 'Ordinária' : 'Extraordinária'}
                        />
                        <TextField
                            value={collection.amount / 100}
                            label='Valor'
                            type='number'
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <Typography
                                        variant='body1'
                                        paddingRight='4px'
                                        sx={(theme: Theme) => ({
                                            color: theme.palette.text.secondary
                                        })}
                                    >
                                        R$
                                    </Typography>
                                )
                            }}
                        />
                        <TextField
                            label='Tipo'
                            name='type'
                            disabled
                            value={collection.type == 'fractional' ? 'Por rateio' : 'Por taxa fixa'}
                        />
                    </Box>
                    <Box display='grid' gap='16px'>
                        <TextField disabled label='Descrição' fullWidth multiline minRows={3} />
                        <FormGroup>
                            <FormLabel id='demo-form-control-label-placement' disabled>
                                Formato da cobrança
                            </FormLabel>
                            <RadioGroup
                                aria-labelledby='demo-controlled-radio-buttons-group'
                                name='controlled-radio-buttons-group'
                                row
                            >
                                <FormControlLabel
                                    checked={collection.format == CollectionFormat.single}
                                    control={<Radio />}
                                    label='Única'
                                    disabled
                                />
                                <FormControlLabel
                                    checked={collection.format == CollectionFormat.recurrent}
                                    control={<Radio />}
                                    label='Recorrente'
                                    disabled
                                />
                                <FormControlLabel
                                    checked={collection.format == CollectionFormat.installments}
                                    control={<Radio />}
                                    label='Parcelado'
                                    disabled
                                />
                            </RadioGroup>
                        </FormGroup>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={deleteCollectionMutation.isPending || deleteMultiplesCollectionMutation.isPending}
                    onClick={onClose}
                >
                    Voltar
                </Button>
                <LoadingButton
                    onClick={() => deleteCollectionMutation.mutate()}
                    variant='contained'
                    loading={deleteCollectionMutation.isPending}
                    disabled={deleteMultiplesCollectionMutation.isPending}
                >
                    Deletar este
                </LoadingButton>
                <LoadingButton
                    onClick={() => deleteMultiplesCollectionMutation.mutate()}
                    variant='contained'
                    disabled={deleteCollectionMutation.isPending}
                    loading={deleteMultiplesCollectionMutation.isPending}
                >
                    Deletar este e os seguintes
                </LoadingButton>
            </DialogActions>
        </DialogComponent>
    )
}

export default DeleteCollection
