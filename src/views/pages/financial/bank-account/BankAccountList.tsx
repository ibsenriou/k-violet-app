import { useQuery } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'


import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import { DataParams } from '@core/components/table/types'

import { BankAccountType } from '@typesApiMapping/apps/financial/bankAccountTypes'
import { FinancialService } from 'src/services/financialService'
import Tooltip from '@mui/material/Tooltip'

type BankAccountListProps = {
    onViewBankAccount: (row: BankAccountType) => void
    onDeleteBankAccount: (row: BankAccountType) => void
    onNewBankAccount: () => void
}

export default function ProductList({
    onViewBankAccount,
    onDeleteBankAccount,
    onNewBankAccount,

 }: BankAccountListProps) {

    const bankAccountQuery = useQuery({
      queryKey: ['bankAccounts'],
      queryFn: () => FinancialService.bank_accounts.get().then(response => response.data),
      select: response => response.results
    })

    const bankAccountList = bankAccountQuery.data

    const deleteButtonDisabledBecauseAccountIsMainAccount = (row: BankAccountType) => row.is_main_account

    return (
        <Table
            searchField={['name', 'description']}
            topRightActionCallback={onNewBankAccount}
            topRightActionLabel='Adicionar Conta Bancária'
            title='Buscar Conta Bancária'
            data={bankAccountList ?? []}
        >
            <TableCell align='left' header='Nome' field='name' />
            <TableCell align='left' header='Conta Principal' field='is_main_account' format={v => (v ? 'Sim' : 'Não')} />
            <TableCell align='left' header='Agência' field='account_agency' />
            <TableCell align='left' header='Número da Conta' field='account_number' />
            <TableCell align='left' header='Dígito da Conta' field='account_number_digit' />


            <TableCell width={135} align='center' header='Ações' field='actions'>
                {({ row }: DataParams<any>) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewBankAccount(row as BankAccountType)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        {/* <IconButton onClick={() => onEditBankAccount(row as BankAccountType)}>
                            <PencilOutline fontSize='small' />
                        </IconButton> */}

                        <Tooltip title={
                            deleteButtonDisabledBecauseAccountIsMainAccount(row as BankAccountType)
                                ? 'Conta Principal não pode ser deletada'
                                : ''
                        }
                         arrow>
                          <span>
                            <IconButton
                                disabled={deleteButtonDisabledBecauseAccountIsMainAccount(row as BankAccountType)}
                                onClick={() => onDeleteBankAccount(row as BankAccountType)}
                            >
                                <DeleteOutline fontSize='small' />
                            </IconButton>
                          </span>
                        </Tooltip>
                    </Box>
                )}
            </TableCell>
        </Table>
    )
}
