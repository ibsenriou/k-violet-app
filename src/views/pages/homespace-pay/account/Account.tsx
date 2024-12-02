import Box from '@mui/material/Box'
import AccountHeader from './components/AccountHeader'
import PaymentList from './components/PaymentList'

type AccountViewProps = {
    onClickCreatePayment: () => void
    onClickCreateTransference: () => void
}
export default function AccountView({ onClickCreatePayment, onClickCreateTransference }: AccountViewProps) {
    return (
        <Box display='grid' gap='10px'>
            <AccountHeader onClickCreateTransference={onClickCreateTransference} />
            <PaymentList onClickCreatePayment={onClickCreatePayment} />
        </Box>
    )
}
