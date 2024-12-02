import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type AssetType = HomespaceBaseModel & {
    description: string
    name: string
    fk_lookup_type_of_asset_category: string
    lookup_type_of_asset_category: string
}
