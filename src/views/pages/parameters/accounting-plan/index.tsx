import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'

import { AccountingService } from 'src/services/accountingService'

import { AccountType } from '@typesApiMapping/apps/accounting/accountTypes'

type AccountTree = {
    [key: string]: AccountTreeItem
}

type AccountTreeItem = {
    id: AccountType['id']
    account: AccountType
    fk_account: AccountType['fk_account']
    children: AccountTree
}

export default function AccountingPlan() {
    const theme = useTheme()

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            return AccountingService.account.get().then(({ data }) => data.results)
        }
    })

    const accounts = (accountQuery.data || []) as AccountType[]
    function resolveTreeItem(parentId: AccountType['id'] | null) {
        const items = accounts.filter(account => account.fk_account === parentId)
        const tree = items.reduce(
            (acc, parent) => ({
                ...acc,
                [parent.id]: {
                    id: parent.id,
                    account: parent,
                    fk_account: parent.fk_account,
                    children: resolveTreeItem(parent.id)
                }
            }),
            {} as AccountTree
        ) as AccountTree
        return tree
    }

    const tree = resolveTreeItem(null)

    function renderTreeLabel(account: AccountType) {
        return (
            <Box display='flex' gap='5px'>
                <Typography
                    style={
                        theme.palette.mode === 'dark'
                            ? {
                                  color: account.nature_of_operation === 1 ? '#79aeff' : '#ff5a5f'
                              }
                            : {
                                  color: account.nature_of_operation === 1 ? '#4169e1' : '#ff4500'
                              }
                    }
                >
                    {account.code}
                </Typography>
                <Typography>- {account.description}</Typography>
            </Box>
        )
    }

    function renderTree(tree: AccountTree) {
        return Object.entries(tree).map(([key, value]) => {
            return (
                <TreeItem key={key} itemId={key} label={renderTreeLabel(value.account)}>
                    {renderTree(value.children)}
                </TreeItem>
            )
        })
    }

    return (
        <Card style={{ height: 'calc(100vh - 64px - 56px - 48px)', padding: '8px' }}>
            <SimpleTreeView sx={{ overflowY: 'auto', maxHeight: '100%' }}>{renderTree(tree)}</SimpleTreeView>
        </Card>
    )
}
