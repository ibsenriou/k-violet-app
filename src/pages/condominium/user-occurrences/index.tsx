import UserOccurrencesLayout from './layout'

export default function UserOccurrencesList() {
    return null
}

UserOccurrencesList.getLayout = function getLayout(page: React.ReactNode) {
    return <UserOccurrencesLayout>{page}</UserOccurrencesLayout>
}

UserOccurrencesList.appendLayout = true
