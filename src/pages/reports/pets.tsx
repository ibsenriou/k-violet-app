import PetReportsView from 'src/views/pages/condominium/reports/PetReport'

function PetsReport() {
    return <PetReportsView />
}

PetsReport.acl = {
    action: 'read',
    subject: 'reports-pets'
}

export default PetsReport
