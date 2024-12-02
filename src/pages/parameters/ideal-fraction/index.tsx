import IdealFractionView from 'src/views/pages/parameters/ideal-fraction/IdealFractionView'

export default function IdealFactionPage() {
    return <IdealFractionView />
}

IdealFactionPage.acl = {
    action: 'read',
    subject: 'ideal-fraction-page'
}
