import AccountingPlanView from 'src/views/pages/parameters/accounting-plan'

export default function AccountingPlan() {
    return <AccountingPlanView />
}

AccountingPlan.acl = {
    action: 'read',
    subject: 'accounting-plan-page'
}
