import GarageReportView from 'src/views/pages/condominium/reports/GarageReport'

function GarageReport() {
    return <GarageReportView />
}

GarageReport.acl = {
    action: 'read',
    subject: 'reports-garage'
}

export default GarageReport
