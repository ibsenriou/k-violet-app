import TextField from '@core/components/inputs/TextField'
import MuiTextField from '@mui/material/TextField'
import LoadingButton from '@core/components/loading-button'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Close from 'mdi-material-ui/Close'
import { Controller, useForm } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import { AccessControlService } from 'src/services/accessControlService'
import { useLayoutEffect, useRef } from 'react'
import { PeopleService } from 'src/services/peopleService'
import Typography from '@mui/material/Typography'

type NewUserRoleProps = {
    onCancel: () => void
    onConfirm: () => void
}

export default function NewUserRole({ onCancel, onConfirm }: NewUserRoleProps) {
    const queryClient = useQueryClient()

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        watch,
        setValue
    } = useForm()

    const roleQuery = useQuery({
        queryKey: ['roles'],
        queryFn: () => AccessControlService.role.get().then(response => response.data),
        select: response => response.results
    })

    const mutation = useMutation({
        mutationFn: (data: any) => AccessControlService.user_role.post(null, data),
        onSuccess: () => {
            onConfirm()
            queryClient.invalidateQueries({
                queryKey: ['user_role']
            })
        }
    })

    const personQuery = useQuery({
        queryKey: ['person', watch('identification')],
        queryFn: () =>
            PeopleService.get_person_data_by_identification.get({
                identification: getValues('identification').replace(/\D/g, '')
            }),
        select: response => response.data,
        enabled: false
    })

    const email = personQuery.data?.person_contact_information_set.find(
        c => c._type_of_contact_information == 'E-mail'
    )?.description

    const name = personQuery.data?.name

    useLayoutEffect(() => {
        if (personQuery.data) {
            setValue('name', name)
            setValue('email', email)
        }
    }, [personQuery.dataUpdatedAt])

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
                        Adicionar Usuário
                    </Typography>
                    <Typography variant='body2'>Insira um usuário nesse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ py: 8, px: { xs: 8, sm: 15 }, position: 'relative' }}>
                <Box
                    sx={{
                        py: 2,
                        display: 'grid',
                        gap: 2
                    }}
                >
                    <FormControl fullWidth>
                        <Controller
                            name='identification'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <ReactInputMask
                                    mask={value?.length < 15 ? '999.999.999-999' : '99.999.999/9999-99'}
                                    maskChar=''
                                    value={value}
                                    onChange={onChange}
                                    onBlur={() => {
                                        if (errors.identification) return
                                        personQuery.refetch()
                                    }}
                                >
                                    {() => <MuiTextField label='CPF ou CNPJ' autoFocus={true} />}
                                </ReactInputMask>
                            )}
                        />
                        {errors.identification && (
                            <FormHelperText error>{errors.identification.message}</FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                        key={name}
                        control={name ? undefined : control}
                        name='name'
                        label='Nome'
                        error={errors.name}
                        rules={{ required: 'Campo obrigatório' }}
                        disabled={
                            (watch('identification') || '').length < 12 || personQuery.isFetching || Boolean(name)
                        }
                        value={name}
                    />
                    <TextField
                        key={email}
                        control={email ? undefined : control}
                        name='email'
                        label='Email'
                        error={errors.email}
                        rules={{ required: 'Campo obrigatório' }}
                        disabled={
                            (watch('identification') || '').length < 12 || personQuery.isFetching || Boolean(email)
                        }
                        value={email}
                    />
                    <FormControl
                        fullWidth
                        error={Boolean(errors.email?.message)}
                        disabled={(watch('identification') || '').length < 12 || personQuery.isFetching}
                    >
                        <InputLabel>Perfil</InputLabel>
                        <Controller
                            render={({ field }) => (
                                <Select value={field.value} onChange={field.onChange} variant='outlined' label='Perfil'>
                                    {(roleQuery.data || []).map(item => (
                                        <MenuItem
                                            key={String(item.id)}
                                            value={item.id as unknown as string}
                                            selected={item.name == field.value}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                            name='fk_role'
                            control={control}
                            rules={{ required: 'Campo obrigatório' }}
                        />
                        {errors.fk_role?.message && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.fk_role?.message}</FormHelperText>
                        )}
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{ marginRight: 1 }}
                    loading={Boolean(mutation?.isPending)}
                    onClick={handleSubmit(data => mutation?.mutate(data))}
                    color='primary'
                >
                    Salvar
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
