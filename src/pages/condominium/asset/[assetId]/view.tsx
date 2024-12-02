import { useRouter } from 'next/router'

import ProductLayout from '../layout'
import ViewAsset from 'src/views/pages/condominium/asset/ViewAsset'

function ViewAssetPage() {
    const router = useRouter()
    const { assetId: assetId } = router.query

    return <ViewAsset onCancel={() => router.push('/condominium/asset')} assetId={assetId as string} />
}

export default ViewAssetPage

ViewAssetPage.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

ViewAssetPage.appendLayout = true
