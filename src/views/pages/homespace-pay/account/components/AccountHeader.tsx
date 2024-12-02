import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Eye from 'mdi-material-ui/Eye'
import EyeOff from 'mdi-material-ui/EyeOff'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { HomespacePayService } from 'src/services/homespacePayService'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type AccountHeaderProps = {
    onClickCreateTransference: () => void
}
export default function AccountHeader({ onClickCreateTransference }: AccountHeaderProps) {
    const [showBalance, setShowBalance] = useState(false)

    const balanceQuery = useQuery({
        queryKey: ['balance'],
        queryFn: async () => {
            const response = await HomespacePayService.finance_balance.get()
            return response.data
        },
        enabled: showBalance
    })

    return (
        <Card>
            <CardContent>
                <Box display='flex' alignItems='center' gap={4}>
                    <TextField
                        label='Saldo'
                        value={showBalance ? balanceQuery?.data?.balance.toFixed(2) ?? '***' : '***'}
                        InputProps={{
                            startAdornment: <Box style={{ marginRight: '5px' }}>R$</Box>,
                            endAdornment: (
                                <IconButton onClick={() => setShowBalance(!showBalance)}>
                                    {balanceQuery.isLoading ? (
                                        <CircularProgress size={20} />
                                    ) : showBalance ? (
                                        <EyeOff />
                                    ) : (
                                        <Eye />
                                    )}
                                </IconButton>
                            )
                        }}
                    />
                    <Button variant='outlined' onClick={onClickCreateTransference}>
                        Transferir Saldo
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}
