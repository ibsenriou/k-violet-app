import TextField from '@core/components/inputs/TextField'
import LoadingButton from '@core/components/loading-button'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Close from 'mdi-material-ui/Close'
import { AccessControlService } from 'src/services/accessControlService'

type DeleteUserRoleProps = {
    onCancel: () => void
    onConfirm: () => void
    userRoleId: string
}

export default function DeleteUserRole({ onCancel, onConfirm, userRoleId }: DeleteUserRoleProps) {
    const queryClient = useQueryClient()

    const userRoleQuery = useQuery({
        queryKey: ['user_role', userRoleId],
        queryFn: () =>
            AccessControlService.user_role_id
                .get({
                    id: userRoleId
                })
                .then(response => response.data)
    })

    const mutation = useMutation({
        mutationFn: () => AccessControlService.user_role_id.delete({ id: userRoleId }),
        onSuccess: () => {
            onConfirm()
            queryClient.invalidateQueries({
                queryKey: ['user_role']
            })
        }
    })

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
                        Deletar Usuário
                    </Typography>
                    <Typography variant='body2'>Deletar usuário do sistema</Typography>
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
                    <TextField name='user_email' label='Email' disabled value={userRoleQuery.data?.user_email} />
                    <TextField name='role' label='Perfil' disabled value={userRoleQuery.data?.role_name} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{ marginRight: 1 }}
                    loading={Boolean(mutation?.isPending)}
                    onClick={() => mutation?.mutate()}
                    color='primary'
                >
                    Deletar
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
