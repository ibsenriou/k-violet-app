import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import Close from '@mui/icons-material/Close'

import BankAccountDetails from './BankAccountDetails'


import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'
import { BankAccountType } from '@typesApiMapping/apps/financial/bankAccountTypes'
import { FinancialService } from 'src/services/financialService'

type NewBankAccountProps = {
    onCancel: () => void
    onConfirm: () => void
}

function NewBankAccount({ onCancel, onConfirm }: NewBankAccountProps) {
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
                        Adicionar Conta Bancária
                    </Typography>
                    <Typography variant='body2'>Insira uma conta bancária nesse condomínio.</Typography>
                </Box>
            </DialogTitle>

            <BankAccountDetails
                disabledAllFields={false}
                onCancel={onCancel}
                onConfirm={onConfirm}
                serviceAction={(data: ProductType) =>
                    FinancialService.bank_accounts.post(null, data).then(result => result.data as BankAccountType)
                }
            />
        </Dialog>
    )
}

export default NewBankAccount
