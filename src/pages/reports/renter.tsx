import RenterReport from 'src/views/pages/condominium/reports/RenterReport'

function RenterReports() {
    return <RenterReport key='Renter' type='Renter' />
}

RenterReports.acl = {
    action: 'read',
    subject: 'reports-renter'
}

export default RenterReports
