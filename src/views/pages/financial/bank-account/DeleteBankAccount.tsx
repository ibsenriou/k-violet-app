import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import BankAccountDetails from './BankAccountDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { CondominiumService } from 'src/services/condominiumService'

import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'
import { FinancialService } from 'src/services/financialService'
import { BankAccountType } from '@typesApiMapping/apps/financial/bankAccountTypes'

type DeleteBankAccountProps = {
    onCancel: () => void
    onConfirm: () => void
    bankAccountId: string
}

function DeleteProduct({ onCancel, onConfirm, bankAccountId }: DeleteBankAccountProps) {
    const queryClient = useQueryClient()

    const bankAccountQuery = useQuery({
        queryKey: ['bankAccounts'],
        queryFn: () => FinancialService.bank_accounts.get().then(response => response.data),
        select: response => response.results.find((service: BankAccountType) => service.id === bankAccountId),
        initialData: queryClient.getQueryState<{ results: BankAccountType[] }>(['bankAccounts'])?.data,
        staleTime: 1000 * 60 * 5
    })

    const bankAccount = bankAccountQuery.data

    return (
        <Dialog fullWidth maxWidth='md' scroll='body' open onClose={onCancel}>
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
                        Remover Conta Bancária
                    </Typography>
                    <Typography variant='body2'>Remova uma conta bancária deste condomínio.</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Alert severity='warning'>
                        <AlertTitle>Atenção!</AlertTitle>
                        {`Esta ação irá excluir permanentemente a conta bancária. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                    </Alert>
                </Box>
            </DialogTitle>
            <BankAccountDetails
                key={bankAccount?.id || 'loading'}
                onConfirmLabel='Excluir'
                onConfirmColor='error'
                onCancel={onCancel}
                onConfirm={onConfirm}
                disabledAllFields={true}
                bankAccount={bankAccount}
                serviceAction={() => FinancialService.bank_account_id.delete({ bankAccountId: bankAccountId })}
            />
        </Dialog>
    )
}

export default DeleteProduct
