import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Close from '@mui/icons-material/Close'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@core/components/inputs/TextField'
import Button from '@mui/material/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import SelectField from '@core/components/inputs/SelectField'
import { UhabType } from '@typesApiMapping/apps/condominium/uhabTypes'
import DialogActions from '@mui/material/DialogActions'
import { HomespacePayService } from 'src/services/homespacePayService'
import moment from 'moment'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

type CreatePaymentViewProps = {
    onCancel: () => void
}
export default function CreatePaymentView({ onCancel }: CreatePaymentViewProps) {
    const { control, watch, handleSubmit } = useForm()
    const queryClient = useQueryClient()

    const residentialsQuery = useQuery({
        queryKey: ['residentials'],
        queryFn: () => CondominiumService.residential.get(),
        select: data => data?.data?.results as unknown as UhabType[]
    })

    const commercialsQuery = useQuery({
        queryKey: ['commercials'],
        queryFn: () => CondominiumService.commercial.get(),
        select: data => data?.data.results as unknown as UhabType[]
    })

    const residentsQuery = useQuery({
        queryKey: ['residents', watch('fk_uhab')],
        queryFn: () =>
            CondominiumService.residentialId_uhab_user_roles.get({ residentialId: watch('fk_uhab'), type: 'Resident' }),
        select: data =>
            (
                data?.data.results as unknown as Array<{
                    id: string
                    person_name: string
                    is_this_the_main_role: boolean
                    fk_person: string
                }>
            ).map(person => ({
                ...person,
                person_name:
                    person.person_name + (person.is_this_the_main_role ? ' (Morador Responsável)' : '(Morador)')
            })),
        enabled: Boolean(watch('fk_uhab'))
    })

    const proprietariesQuery = useQuery({
        queryKey: ['proprietaries', watch('fk_uhab')],
        queryFn: () =>
            CondominiumService.residentialId_uhab_user_roles.get({
                residentialId: watch('fk_uhab'),
                type: 'Proprietary'
            }),
        select: data =>
            (
                data?.data.results as unknown as Array<{
                    id: string
                    person_name: string
                    fk_person: string
                }>
            ).map(person => ({ ...person, person_name: person.person_name + '(Proprietário)' })),
        enabled: Boolean(watch('fk_uhab'))
    })

    const createPaymentMutation = useMutation({
        mutationFn: async (data: any) => HomespacePayService.payment.post(null, data),
        onSettled: () => onCancel(),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['payments']
            })
    })

    const uhab = ([] as UhabType[]).concat(residentialsQuery.data || [], commercialsQuery.data || [])
    const uhabPeople = ([] as any[]).concat(residentsQuery.data || [], proprietariesQuery.data || [])

    return (
        <Dialog fullWidth maxWidth='sm' scroll='body' open onClose={onCancel}>
            <DialogTitle sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onCancel()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Criar Cobrança
                    </Typography>
                    <Typography variant='body2'>Preencha os campos abaixo para criar uma nova cobrança.</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={6} padding={2}>
                    <Grid item xs={6}>
                        <SelectField
                            control={control}
                            items={uhab}
                            keyLabel='name'
                            keyValue='id'
                            name='fk_uhab'
                            label='Unidade'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <SelectField
                            key={watch('fk_uhab') + uhabPeople?.length}
                            control={control}
                            items={uhabPeople || []}
                            keyLabel='person_name'
                            keyValue='fk_person'
                            name='fk_person'
                            label='Responsável'
                            defaultValue={uhabPeople?.find(item => item.is_this_the_main_role)?.fk_person}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Valor'
                            name='value'
                            startAdornment={<Box marginRight={'5px'}>R$</Box>}
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Controller
                                control={control}
                                name='due_date'
                                defaultValue={moment()}
                                render={({ field: { value, onChange } }) => (
                                    <DatePicker label='Data de Vencimento' value={value} onChange={onChange} />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={6}>
                        <SelectField
                            control={control}
                            items={[
                                {
                                    id: 'FIXED',
                                    name: 'Fixo'
                                },
                                {
                                    id: 'PERCENTAGE',
                                    name: 'Percentagem'
                                }
                            ]}
                            keyLabel='name'
                            keyValue='id'
                            name='fine_type'
                            label='Tipo de Multa'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Multa'
                            name='fine'
                            startAdornment={watch('fine_type') == 'FIXED' ? <Box marginRight={'5px'}>R$</Box> : null}
                            endAdornment={watch('fine_type') == 'PERCENTAGE' ? <Box marginLeft={'5px'}>%</Box> : null}
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Juros mensal'
                            name='interest'
                            endAdornment={<Box marginLeft={'5px'}>%</Box>}
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Descrição' name='description' control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Detalhes de cobrança' name='billing_details' multiline control={control} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2, gap: 2 }}>
                    <Button onClick={onCancel} variant='outlined'>
                        Cancelar
                    </Button>
                    <Button variant='contained' onClick={handleSubmit(data => createPaymentMutation.mutate(data))}>
                        Criar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
