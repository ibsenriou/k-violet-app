import PeopleReport from 'src/views/pages/condominium/reports/PeopleReport'

function EmployeeReport() {
    return <PeopleReport key='Employee' type='Employee' />
}

EmployeeReport.acl = {
    action: 'read',
    subject: 'reports-employee'
}

export default EmployeeReport
