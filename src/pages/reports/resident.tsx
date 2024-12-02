import PeopleReport from 'src/views/pages/condominium/reports/PeopleReport'

function ResidentReports() {
    return <PeopleReport key='Resident' type='Resident' />
}

ResidentReports.acl = {
    action: 'read',
    subject: 'reports-resident'
}

export default ResidentReports
