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

type EditBankAccountProps = {
    onCancel: () => void
    onConfirm: () => void
    bankAccountId: string
}

function EditBankAccount({ onCancel, onConfirm, bankAccountId }: EditBankAccountProps) {
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
                        Atualizar Conta Bancária
                    </Typography>
                    <Typography variant='body2'>Atualize uma Conta Bancária desse condomínio.</Typography>
                </Box>
            </DialogTitle>
            <BankAccountDetails
                key={bankAccount?.id || 'loading'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                bankAccount={bankAccount}
                serviceAction={(data: BankAccountType) =>
                    FinancialService.bank_account_id.put({ bankAccountId }, data).then(response => response.data)
                }
            />
        </Dialog>
    )
}

export default EditBankAccount
