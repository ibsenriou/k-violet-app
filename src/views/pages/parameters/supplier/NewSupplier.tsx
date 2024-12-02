import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'

import Close from '@mui/icons-material/Close'

import { useState } from 'react'

import SupplierDetails from './SupplierDetails'

import { SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { CondominiumService } from 'src/services/condominiumService'

type NewSupplierProps = {
    onCancel: () => void
    onConfirm: (supplierId: string) => void
}

function NewSupplier({ onCancel, onConfirm }: NewSupplierProps) {
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false)

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
                        Adicionar Fornecedor
                    </Typography>
                    <Typography variant='body2'>Insira um fornecedor nesse condomínio.</Typography>
                </Box>

                {/* <Box sx={{ mb: 8 }}>
                    {disableSaveButton && (
                        <Alert severity='error'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Não é possível adicionar um fornecedor que já existe. Esse CPF/CNPJ já está cadastrado.`}
                        </Alert>
                    )}
                </Box> */}
            </DialogTitle>

            <SupplierDetails
                disabledAllFields={false}
                setDisableSaveButton={setDisableSaveButton}
                onCancel={onCancel}
                onConfirm={onConfirm}
                serviceAction={(data: SupplierType) =>
                    CondominiumService.suppliers.post(null, data).then(result => result.data as SupplierType)
                }
            />
        </Dialog>
    )
}

export default NewSupplier
