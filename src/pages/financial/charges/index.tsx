import ChargeLayout from './layout'

export default function ChargeList() {
    return null
}

ChargeList.getLayout = function getLayout(page: React.ReactNode) {
    return <ChargeLayout>{page}</ChargeLayout>
}

ChargeList.appendLayout = true
