import { LookupTypeOfCondominiumGroupingType } from '@typesApiMapping/apps/lookups/lookupTypeOfCondominiumGroupingTypes'
import { LookupTypeOfContactInformationType } from '@typesApiMapping/apps/lookups/lookupTypeOfContactInformationTypes'
import { LookupTypeOfResidentialType } from '@typesApiMapping/apps/lookups/lookupTypeOfResidentialTypes'
import { LookupTypeOfCommercialType } from '@typesApiMapping/apps/lookups/lookupTypeOfCommercialTypes'
import { LookupTypeOfUhabUserRoleType } from '@typesApiMapping/apps/lookups/lookupTypeOfUhabUserRoleTypes'
import { LookupTypeOfAssetCategoryType } from '@typesApiMapping/apps/lookups/lookupTypeOfAssetCategoryTypes'
import { createUrl } from './Url'
import { LookupTypeOfBankAccountType } from '@typesApiMapping/apps/lookups/lookupTypeOfBankAccountTypes'

export const LookupsService = {
    lookup_type_of_condominium_grouping: createUrl<null, LookupTypeOfCondominiumGroupingType[]>(
        '/lookups/lookup_type_of_condominium_grouping/'
    ),
    lookup_type_of_condominium_groupingId: createUrl<
        { condominiumGroupingId: string },
        LookupTypeOfCondominiumGroupingType
    >('/lookups/lookup_type_of_condominium_grouping/:condominiumGroupingId/'),
    lookup_type_of_contact_information: createUrl<null, LookupTypeOfContactInformationType[]>(
        '/lookups/lookup_type_of_contact_information/'
    ),
    lookup_type_of_contact_informationId: createUrl<
        { contactInformationId: string },
        LookupTypeOfContactInformationType
    >('/lookups/lookup_type_of_contact_information/:contactInformationId/'),
    lookup_type_of_residential: createUrl<null, LookupTypeOfResidentialType[]>('/lookups/lookup_type_of_residential/'),
    lookup_type_of_residentialId: createUrl<{ residentialId: string }, LookupTypeOfResidentialType>(
        '/lookups/lookup_type_of_residential/:residentialId/'
    ),

    lookup_type_of_commercial: createUrl<null, LookupTypeOfCommercialType[]>('/lookups/lookup_type_of_commercial/'),
    lookup_type_of_commercialId: createUrl<{ commercialId: string }, LookupTypeOfCommercialType>(
        '/lookups/lookup_type_of_commercial/:commercialId/'
    ),

    lookup_type_of_uhab_user_role: createUrl<null, LookupTypeOfUhabUserRoleType[]>(
        '/lookups/lookup_type_of_uhab_user_role/'
    ),

    lookup_type_of_asset_category: createUrl<null, LookupTypeOfAssetCategoryType[]>(
        '/lookups/lookup_type_of_asset_category/'
    ),
    lookup_type_of_bank_account: createUrl<null, LookupTypeOfBankAccountType[]>('/lookups/lookup_type_of_bank_account/'),
    lookup_type_of_condominium_user_occurrence: createUrl<null, LookupTypeOfBankAccountType[]>('/lookups/lookup_type_of_condominium_user_occurrence/'),
}
