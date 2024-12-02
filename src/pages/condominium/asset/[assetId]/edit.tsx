import { useRouter } from 'next/router'
import AssetLayout from '../layout'
import EditAsset from 'src/views/pages/condominium/asset/EditAsset'

function EditAssetPage() {
    const router = useRouter()
    const { assetId: assetId } = router.query

    return (
        <EditAsset
            onCancel={() => router.push('/condominium/asset')}
            onConfirm={() => router.push('/condominium/asset')}
            assetId={assetId as string}
        />
    )
}

export default EditAssetPage

EditAssetPage.getLayout = function getLayout(page: React.ReactNode) {
    return <AssetLayout>{page}</AssetLayout>
}

EditAssetPage.appendLayout = true
