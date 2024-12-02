import BankAccountLayout from "./layout";

export default function BankAccountPage() {
    return null
}

BankAccountPage.getLayout = function getLayout(page: React.ReactNode) {
    return <BankAccountLayout>{page}</BankAccountLayout>
}

BankAccountPage.appendLayout = true
