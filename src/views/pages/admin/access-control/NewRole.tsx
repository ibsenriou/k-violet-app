import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@core/components/inputs/TextField'
import LoadingButton from '@core/components/loading-button'
import { useForm } from 'react-hook-form'
import { RoleType } from '@typesApiMapping/apps/access-control/roleTypes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccessControlService } from 'src/services/accessControlService'

type NewRoleProps = {
    onCancel: () => void
    onConfirm: (role: RoleType) => void
}

function NewRole({ onCancel, onConfirm }: NewRoleProps) {
    const queryClient = useQueryClient()
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm<RoleType>()

    const mutation = useMutation({
        mutationFn: (data: RoleType) => AccessControlService.role.post(null, data),
        onSuccess: response => {
            queryClient.invalidateQueries({
                queryKey: ['roles']
            })
            onConfirm(response.data)
        }
    })

    return (
        <Dialog fullWidth maxWidth='xs' scroll='body' open onClose={onCancel}>
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
                        Adicionar Perfil
                    </Typography>
                    <Typography variant='body2'>Insira um perfil para esse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ py: 8, px: { xs: 8, sm: 15 }, position: 'relative' }}>
                <Box
                    sx={{
                        py: 2
                    }}
                >
                    <TextField label='Nome' name='name' control={control} error={errors.name} />
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

export default NewRole
