import { useRouter } from 'next/router'
import CreateAccountView from 'src/views/pages/homespace-pay/account/CreateAccount'

export default function CreateAccount() {
  const route = useRouter()

  return <CreateAccountView onCreateAccount={() => route.push('/homespace-pay/account/pending-documents')} />
}
