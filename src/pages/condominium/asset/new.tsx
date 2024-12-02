import { useRouter } from 'next/router'
import NewAsset from 'src/views/pages/condominium/asset/NewAsset'
import AssetLayout from './layout'

function NewAssetPage() {
    const router = useRouter()

    return (
        <NewAsset
            onCancel={() => router.push('/condominium/asset')}
            onConfirm={() => router.push('/condominium/asset')}
        />
    )
}

NewAssetPage.getLayout = function getLayout(page: React.ReactNode) {
    return <AssetLayout>{page}</AssetLayout>
}

NewAssetPage.appendLayout = true

export default NewAssetPage
