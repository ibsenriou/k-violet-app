import { useRouter } from 'next/router'
import Card from '@mui/material/Card'

import AssetList from 'src/views/pages/condominium/asset/AssetList'

export default function AssetLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Card>
            <AssetList
                onViewAsset={row => router.push(`/condominium/asset/${row.id}/view`)}
                onDeleteAsset={row => router.push(`/condominium/asset/${row.id}/delete`)}
                onEditAsset={row => router.push(`/condominium/asset/${row.id}/edit`)}
                onNewAsset={() => router.push('/condominium/asset/new')}
            />
            {children}
        </Card>
    )
}
