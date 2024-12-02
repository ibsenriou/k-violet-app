import TextField from '@core/components/inputs/TextField'

import LoadingButton from '@core/components/loading-button'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    DistributionType,
    IdealFractionType,
    NewIdealFractionType
} from '@typesApiMapping/apps/condominium/idealFractionTypes'
import Close from 'mdi-material-ui/Close'
import { Controller, useForm } from 'react-hook-form'
import useSnackbar from 'src/hooks/useSnackbar'
import { CondominiumService } from 'src/services/condominiumService'
import SelectField from '@core/components/inputs/SelectField'

type NewIdealFractionDialogProps = {
    open: boolean
    onClose: () => void
}
export default function NewIdealFractionDialog({ open, onClose }: NewIdealFractionDialogProps) {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<NewIdealFractionType>()

    const { error } = useSnackbar()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: NewIdealFractionType) => {
            const response = await CondominiumService.ideal_fraction.post(null, data)
            return response.data as IdealFractionType
        },
        onSuccess: createdIdealFraction => {
            queryClient.invalidateQueries({ queryKey: ['IdealFraction'] })
            onClose()
        },
        onError: () => {
            error('Erro ao adicionar fração ideal. Tente novamente mais tarde.')
        }
    })

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onClose()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Adicionar Fração Ideal
                    </Typography>
                    <Typography variant='body2'>Insira uma nova fração ideal</Typography>
                </Box>
                <Box sx={{ py: '1rem', display: 'grid', gap: 4 }}>
                    <TextField
                        control={control}
                        label='Nome'
                        name='description'
                        rules={{ required: 'Campo obrigatório' }}
                        error={errors.description}
                    />

                    <SelectField
                        control={control}
                        name='distribution_type'
                        items={[
                            {
                                label: 'Distribuição igual por unidade',
                                value: DistributionType.EQUAL_DISTRIBUTION_PER_UNIT
                            },
                            { label: 'Distribuição manual', value: DistributionType.MANUAL_DISTRIBUTION }
                        ]}
                        label='Distribuição'
                        keyLabel='label'
                        keyValue='value'
                        rules={{ required: 'Campo obrigatório' }}
                        error={errors.distribution_type}
                    />

                    <FormControl>
                        <Controller
                            name='is_main'
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} />}
                                    label='Principal'
                                    labelPlacement='end'
                                />
                            )}
                        />
                        <FormHelperText>
                            Atribuir como principal, qualquer fração ideal anteriormente marcada como principal será
                            desmarcada.
                        </FormHelperText>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 5, sm: 5 }, justifyContent: 'center' }}>
                <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{ marginRight: 1 }}
                    loading={mutation.isPending}
                    onClick={handleSubmit(data => mutation.mutate(data))}
                    color='primary'
                >
                    Salvar
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={onClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
