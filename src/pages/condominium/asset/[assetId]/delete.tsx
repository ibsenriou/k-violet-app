import { useRouter } from 'next/router'
import DeleteAsset from 'src/views/pages/condominium/asset/DeleteAsset'
import AssetLayout from '../layout'

function DeleteAssetPage() {
    const router = useRouter()
    const { assetId } = router.query

    return (
        <DeleteAsset
            onCancel={() => router.push('/condominium/asset')}
            onConfirm={() => router.push('/condominium/asset')}
            assetId={assetId as string}
        />
    )
}

export default DeleteAssetPage

DeleteAssetPage.getLayout = function getLayout(page: React.ReactNode) {
    return <AssetLayout>{page}</AssetLayout>
}

DeleteAssetPage.appendLayout = true
