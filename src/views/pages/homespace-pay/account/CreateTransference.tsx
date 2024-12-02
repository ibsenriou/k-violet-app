import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DialogContent from '@mui/material/DialogContent'
import Close from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Stepper from '@core/components/stepper'
import TransferAccount from './components/transfer-steps/TransferAccount'
import TransferAuthorization from './components/transfer-steps/TransferAuthorization'
import TransferConfirmation from './components/transfer-steps/TransferConfirmation'
import { HomespacePayService } from 'src/services/homespacePayService'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import LoadingButton from '@core/components/loading-button'

type CreateTransferenceViewProps = {
    onClose: () => void
}
function CreateTransferenceView({ onClose }: CreateTransferenceViewProps) {
    const [actionData, setActionData] = useState<{ id: string; type: string; actionToken: string }>()
    const transferDataForm = useForm()
    const validationCodeForm = useForm()

    const actionDataRef = useRef(actionData)
    actionDataRef.current = actionData

    const createAuthorizationMutation = useMutation({
        mutationFn: async () => {
            const response = await HomespacePayService.action_create_authorization.post(
                null,
                transferDataForm.getValues()
            )
            return setActionData(response.data)
        }
    })

    const validateAuthorizationMutation = useMutation({
        mutationFn: async (actionData: { id: string; type: string; actionToken: string }) => {
            const authorizationData = {
                ...actionData,
                ...validationCodeForm.getValues(),
                actionData: transferDataForm.getValues()
            }
            const response = await HomespacePayService.action_validate_authorization.post(null, authorizationData)
            return setActionData(response.data)
        }
    })

    const createTransferMutation = useMutation({
        mutationFn: () =>
            HomespacePayService.transfer.post(null, {
                ...transferDataForm.getValues(),
                action: { ...actionDataRef.current, actionData: transferDataForm.getValues() }
            }),
        onSuccess: () => onClose()
    })

    const { nextLabel, nextStep, prevLabel, prevStep, activeStep } = Stepper.useController({
        onCancel: onClose,
        finishLabel: 'Transferir',
        onFinish: createTransferMutation.mutate
    })

    useEffect(() => {
        if (activeStep == 0) {
            setActionData(undefined)
        }
    }, [transferDataForm.watch()])

    return (
        <Dialog fullWidth maxWidth='md' scroll='body' open onClose={onClose}>
            <DialogTitle sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onClose()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Transferir Saldo
                    </Typography>
                    <Typography variant='body2'>Preencha os campos abaixo para criar uma nova cobrança.</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stepper.Container>
                    <Stepper.Step
                        id='transfer-account'
                        title='Dados de Transferencia'
                        formProvider={transferDataForm}
                        beforeNext={async () => actionDataRef.current?.id || createAuthorizationMutation.mutateAsync()}
                    >
                        <TransferAccount />
                    </Stepper.Step>
                    <Stepper.Step
                        id='transfer-authorization'
                        title='Autorização'
                        formProvider={validationCodeForm}
                        beforeNext={async () =>
                            actionDataRef.current?.actionToken ||
                            validateAuthorizationMutation.mutateAsync(actionDataRef.current!)
                        }
                    >
                        <TransferAuthorization />
                    </Stepper.Step>
                    <Stepper.Step
                        id='transfer-confirmation'
                        title='Confirmação dos dados'
                        formProvider={transferDataForm}
                    >
                        <TransferConfirmation />
                    </Stepper.Step>
                </Stepper.Container>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2, gap: 2 }}>
                    <Button onClick={prevStep} variant='outlined'>
                        {prevLabel}
                    </Button>
                    <LoadingButton
                        onClick={nextStep}
                        variant='contained'
                        loading={
                            createTransferMutation.isPending ||
                            createAuthorizationMutation.isPending ||
                            validateAuthorizationMutation.isPending
                        }
                    >
                        {nextLabel}
                    </LoadingButton>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default Stepper.connect(CreateTransferenceView)
