import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Close from '@mui/icons-material/Close'

import BankAccountDetails from './BankAccountDetails'

import { useQuery, useQueryClient } from '@tanstack/react-query'


import { BankAccountType } from '@typesApiMapping/apps/financial/bankAccountTypes'
import { FinancialService } from 'src/services/financialService'

type ViewBankAccountProps = {
    onCancel: () => void
    bankAccountId: string
}

function ViewBankAccount({ onCancel, bankAccountId }: ViewBankAccountProps) {
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
                        Visualizar Conta Bancária
                    </Typography>
                    <Typography variant='body2'>Visualize as informações de uma conta bancária desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <BankAccountDetails
                onCancel={onCancel}
                key={bankAccount?.id || 'loading'}
                disabledAllFields={true}
                bankAccount={bankAccount}
            />
        </Dialog>
    )
}

export default ViewBankAccount
