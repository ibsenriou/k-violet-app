import { useRouter } from 'next/router'
import UserOccurrenceLayout from './layout'
import NewUserOccurrence from 'src/views/pages/condominium/user-occurrences/NewUserOccurrence'

function NewUserOccurrencePage() {
  const router = useRouter()

  return (
    <NewUserOccurrence
      onCancel={() => router.push('/condominium/user-occurrences')}
      onConfirm={() => router.push('/condominium/user-occurrences')}
    />
  )
}

NewUserOccurrencePage.getLayout = function getLayout(page: React.ReactNode) {
  return <UserOccurrenceLayout>{page}</UserOccurrenceLayout>
}

NewUserOccurrencePage.appendLayout = true

export default NewUserOccurrencePage
