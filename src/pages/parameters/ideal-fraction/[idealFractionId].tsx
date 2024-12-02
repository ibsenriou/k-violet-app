import { useRouter } from 'next/router'
import IdealFractionDetailsView from 'src/views/pages/parameters/ideal-fraction/IdealFractionDetailsView'

function IdealFractionDetailPage() {
    const router = useRouter()
    const idealFractionId = router.query.idealFractionId as string

    return <IdealFractionDetailsView key={idealFractionId} idealFractionId={idealFractionId} />
}

IdealFractionDetailPage.acl = {
    action: 'read',
    subject: 'ideal-fraction-page--detail'
}

export default IdealFractionDetailPage
