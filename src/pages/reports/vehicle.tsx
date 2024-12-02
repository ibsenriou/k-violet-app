import VehicleReportsView from 'src/views/pages/condominium/reports/VehicleReport'

function VehicleReports() {
    return <VehicleReportsView />
}

VehicleReports.acl = {
    action: 'read',
    subject: 'reports-vehicle'
}

export default VehicleReports
