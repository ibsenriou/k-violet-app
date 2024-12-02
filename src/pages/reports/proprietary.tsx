import PeopleReport from 'src/views/pages/condominium/reports/PeopleReport'

function ProprietaryReport() {
    return <PeopleReport key='Proprietary' type='Proprietary' />
}

ProprietaryReport.acl = {
    action: 'read',
    subject: 'reports-proprietary'
}

export default ProprietaryReport
