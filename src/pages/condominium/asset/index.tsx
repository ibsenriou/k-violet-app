import AssetLayout from './layout'

export default function AssetList() {
    return null
}

AssetList.getLayout = function getLayout(page: React.ReactNode) {
    return <AssetLayout>{page}</AssetLayout>
}

AssetList.appendLayout = true
