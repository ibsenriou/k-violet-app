import { CondominiumCommonAreaArchiveOfRulesType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaArchiveOfRulesTypes'
import { CondominiumCommonAreaItemType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaItemTypes'
import { CondominiumCommonAreaReservationPeriodType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationPeriodTypes'
import { CondominiumCommonAreaReservationType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaReservationTypes'
import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'
import { CondominiumCommonAreaUtilizationFeeHistoryType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaUtilizationFeeHistoryTypes'
import { CondominiumContactInformationType } from '@typesApiMapping/apps/condominium/condominiumContactInformationTypes'
import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'
import { CondominiumType } from '@typesApiMapping/apps/condominium/condominiumTypes'
import { GarageType } from '@typesApiMapping/apps/condominium/garageTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'
import { UhabType } from '@typesApiMapping/apps/condominium/uhabTypes'
import { UhabUserRoleType } from '@typesApiMapping/apps/condominium/uhabUserRoleTypes'
import { EmployeeType } from '@typesApiMapping/apps/people/employeeTypes'
import { NaturalPersonType } from '@typesApiMapping/apps/people/naturalPersonTypes'
import { PetType } from '@typesApiMapping/apps/pets/petTypes'
import { VehicleType } from '@typesApiMapping/apps/vehicles/vehicleTypes'
import { createUrl } from './Url'
import { ReadingItemType } from '@typesApiMapping/apps/condominium/ReadingItemTypes'
import { AssetType } from '@typesApiMapping/apps/condominium/assetTypes'
import { SearchSupplierType, SupplierType } from '@typesApiMapping/apps/people/supplierTypes'
import { ServiceType } from '@typesApiMapping/apps/condominium/serviceTypes'
import { ProductType } from '@typesApiMapping/apps/condominium/productTypes'
import { IdealFractionType } from '@typesApiMapping/apps/condominium/idealFractionTypes'
import { UhabIdealFractionType } from '@typesApiMapping/apps/condominium/uhabIdealFractionTypes'
import { LookupTypeOfAssetCategoryType } from '@typesApiMapping/apps/lookups/lookupTypeOfAssetCategoryTypes'
import { CondominiumUserOccurrenceType } from '@typesApiMapping/apps/condominium/condominiumUserOccurrenceTypes'
import { CondominiumCalendarEventType } from '@typesApiMapping/apps/condominium/condominiumCalendarEventTypes'

/**
 * @private
 * Creates a URL for Condominium-specific endpoints by automatically prepending "/condominium"
 * @param urlSegment - The specific URL segment for the Condominium service.
 * @returns A function to generate a full URL with query parameters and dynamic segments.
 */
const _createCondominiumUrl = <T = any, U = any>(urlSegment: string) => {
  return createUrl<T, U>('/condominium' + urlSegment)
}

/**
 * @private
 * Creates a URL for a Condominium-specific endpoint while leveraging the _createCondominiumUrl function to prepend "/condominium" to the URL.
 */
export const CondominiumService = {
  condominium: _createCondominiumUrl('/condominium'),
  condominiumId: _createCondominiumUrl<{ condominiumId: string }, CondominiumType>('/condominium/:condominiumId'),
  get_condominium_id_by_uhab_id: _createCondominiumUrl<{ fk_uhab: string }, string>(
    '/condominium/:fk_uhab/get_condominium_id_by_uhab_id/'
  ),
  condominiumId_condominium_common_area: _createCondominiumUrl<
    { condominiumId: string },
    CondominiumCommonAreaType[]
  >('/condominium/:condominiumId/condominium_common_area/'),
  condominiumId_condominium_grouping: _createCondominiumUrl<{ condominiumId: string }, CondominiumGroupingType[]>(
    '/condominium/:condominiumId/condominium_grouping/'
  ),
  condominiumId_garage: _createCondominiumUrl<{ condominiumId: string }, GarageType>(
    '/condominium/:condominiumId/garage/'
  ),
  condominiumId_residential: _createCondominiumUrl<{ condominiumId: string }, ResidentialType[]>(
    '/condominium/:condominiumId/residential/'
  ),
  condominiumId_residential_by_role: _createCondominiumUrl<
    { condominiumId: string; role_description: string },
    ResidentialType[]
  >('/condominium/:condominiumId/residential_by_role/?role_description=:role_description'),
  condominiumId_commercial: _createCondominiumUrl<{ condominiumId: string }, CommercialType[]>(
    '/condominium/:condominiumId/commercial/'
  ),
  condominiumId_commercial_by_role: _createCondominiumUrl<
    { condominiumId: string; role_description: string },
    CommercialType[]
  >('/condominium/:condominiumId/commercial_by_role/?role_description=:role_description'),
  condominium_calendar_event: _createCondominiumUrl<null, CondominiumCalendarEventType[]>('/condominium_calendar_event/'),
  condominium_calendar_eventId: _createCondominiumUrl<{ condominiumCalendarEventId: string }, CondominiumCalendarEventType>(
    '/condominium_calendar_event/:condominiumCalendarEventId/'
  ),
  condominium_common_area: _createCondominiumUrl('/condominium_common_area/'),
  condominium_common_areaId: _createCondominiumUrl<{ commonAreaId: string }, CondominiumCommonAreaType>(
    '/condominium_common_area/:commonAreaId/'
  ),
  condominium_common_areaId_condominium_common_area_items: _createCondominiumUrl<
    { commonAreaId: string },
    CondominiumCommonAreaItemType[]
  >('/condominium_common_area/:commonAreaId/condominium_common_area_items/'),
  condominium_common_area_archive_of_rules: _createCondominiumUrl('/condominium_common_area_archive_of_rules/'),
  condominium_common_area_archive_of_rulesId: _createCondominiumUrl<
    { archiveOfRulesId: string },
    CondominiumCommonAreaArchiveOfRulesType
  >('/condominium_common_area_archive_of_rules/:archiveOfRulesId/'),
  condominium_common_area_item: _createCondominiumUrl('/condominium_common_area_item/'),
  condominium_common_area_itemId: _createCondominiumUrl<{ itemId: string }, CondominiumCommonAreaItemType>(
    '/condominium_common_area_item/:itemId/'
  ),
  condominium_common_area_reservation: _createCondominiumUrl('/condominium_common_area_reservation/'),
  condominium_common_area_reservationId: _createCondominiumUrl<
    { reservationId: string },
    CondominiumCommonAreaReservationType
  >('/condominium_common_area_reservation/:reservationId/'),
  condominium_common_area_reservation_period: _createCondominiumUrl('/condominium_common_area_reservation_period/'),
  condominium_common_area_reservation_periodId: _createCondominiumUrl<
    { reservationPeriodId: string },
    CondominiumCommonAreaReservationPeriodType
  >('/condominium_common_area_reservation_period/:reservationPeriodId/'),
  condominium_common_area_utilization_fee_history: _createCondominiumUrl(
    '/condominium_common_area_utilization_fee_history/'
  ),
  condominium_common_area_utilization_fee_historyId: _createCondominiumUrl<
    { utilizationFeeHistoryId: string },
    CondominiumCommonAreaUtilizationFeeHistoryType
  >('/condominium_common_area_utilization_fee_history/:utilizationFeeHistoryId/'),
  condominium_contact_information: _createCondominiumUrl('/condominium_contact_information/'),
  condominium_contact_informationId: _createCondominiumUrl<
    { contactInformationId: string },
    CondominiumContactInformationType
  >('/condominium_contact_information/:contactInformationId/'),
  condominium_grouping: _createCondominiumUrl('/condominium_grouping/'),
  condominium_groupingId: _createCondominiumUrl<{ groupingId: string }, CondominiumGroupingType>(
    '/condominium_grouping/:groupingId/'
  ),
  condominium_user_occurrence: _createCondominiumUrl('/condominium_user_occurrence/'),
  condominium_user_occurrenceId: _createCondominiumUrl<{ userOccurrenceId: string }, CondominiumUserOccurrenceType>(
    '/condominium_user_occurrence/:userOccurrenceId/'
  ),
  condominium_user_occurrenceId_comment: _createCondominiumUrl<{ userOccurrenceId: string }, CondominiumUserOccurrenceType>(
    '/condominium_user_occurrence/:userOccurrenceId/add_comment/'
  ),
  condominium_user_occurrenceId_mark_as_in_progress: _createCondominiumUrl<{ userOccurrenceId: string }, CondominiumUserOccurrenceType>(
    '/condominium_user_occurrence/:userOccurrenceId/mark_as_in_progress/'
  ),
  condominium_user_occurrenceId_mark_as_resolved: _createCondominiumUrl<{ userOccurrenceId: string }, CondominiumUserOccurrenceType>(
    '/condominium_user_occurrence/:userOccurrenceId/mark_as_resolved/'
  ),
  garage: _createCondominiumUrl('/garage/'),
  garageId: _createCondominiumUrl<{ garageId: string }, GarageType>('/garage/:garageId/'),
  residential: _createCondominiumUrl<null, ResidentialType[]>('/residential/'),
  residentialId: _createCondominiumUrl<{ residentialId: string }, ResidentialType>('/residential/:residentialId/'),
  residentialId_employees: _createCondominiumUrl<{ residentialId: string }, EmployeeType[]>(
    '/residential/:residentialId/employees/'
  ),

  residentialId_create_employee: _createCondominiumUrl<{ residentialId: string }, EmployeeType>(
    '/residential/:residentialId/create_employee/'
  ),

  residentialId_update_employee: _createCondominiumUrl<{ residentialId: string }, EmployeeType>(
    '/residential/:residentialId/update_employee/'
  ),

  residentialId_delete_employee: _createCondominiumUrl<{ residentialId: string; employeeId: string }, EmployeeType>(
    '/residential/:residentialId/delete_employee?employeeId=:employeeId'
  ),

  residentialId_garage: _createCondominiumUrl<{ residentialId: string }, GarageType[]>(
    '/residential/:residentialId/garage/'
  ),
  residentialId_pets: _createCondominiumUrl<{ residentialId: string }, PetType[]>(
    '/residential/:residentialId/pets/'
  ),
  residentialId_proprietaries: _createCondominiumUrl<{ residentialId: string }, NaturalPersonType[]>(
    '/residential/:residentialId/proprietaries/'
  ),
  residentialId_create_proprietary: _createCondominiumUrl<{ residentialId: string }, NaturalPersonType>(
    '/residential/:residentialId/create_proprietary/'
  ),

  residentialId_delete_proprietary: _createCondominiumUrl<
    {
      residentialId: string
      personId: string
    },
    NaturalPersonType
  >('/residential/:residentialId/delete_proprietary/?fk_person=:personId'),

  residentialId_create_resident: _createCondominiumUrl<{ residentialId: string }, NaturalPersonType>(
    '/residential/:residentialId/create_resident/'
  ),

  // Asset Category

  asset_category: _createCondominiumUrl<null, LookupTypeOfAssetCategoryType[]>('/asset_category/'),
  asset_categoryId: _createCondominiumUrl<{ asset_categoryId: string }, LookupTypeOfAssetCategoryType>(
    '/asset_category/:asset_categoryId/'
  ),

  // Asset
  asset: _createCondominiumUrl<null, AssetType[]>('/asset/'),
  assetId: _createCondominiumUrl<{ assetId: string }, AssetType>('/asset/:assetId/'),

  // price_of_reading_item: _createCondominiumUrl<null, ReadingItemType[]>('/price_of_reading_item/'),
  // price_of_reading_itemId: _createCondominiumUrl<{ price_of_reading_itemId: string }, ReadingItemType>(
  //     '/price_of_reading_item/:price_of_reading_itemId/'
  // ),
  residentialId_update_resident: _createCondominiumUrl<{ residentialId: string }, NaturalPersonType>(
    '/residential/:residentialId/update_resident/'
  ),
  residentialId_delete_resident: _createCondominiumUrl<
    { residentialId: string; residentId: string },
    NaturalPersonType
  >('/residential/:residentialId/delete_resident/?fk_person=:residentId'),

  residentialId_residents: _createCondominiumUrl<{ residentialId: string }, NaturalPersonType[]>(
    '/residential/:residentialId/residents/'
  ),
  residentialId_vehicles: _createCondominiumUrl<{ residentialId: string }, VehicleType[]>(
    '/residential/:residentialId/vehicles/'
  ),
  residentialId_uhab_user_roles: _createCondominiumUrl<
    { residentialId: string; type: 'Resident' | 'Proprietary' },
    any
  >('/residential/:residentialId/uhab_user_roles/?type=:type'),

  // ############
  commercial: _createCondominiumUrl<null, CommercialType[]>('/commercial/'),
  commercialId: _createCondominiumUrl<{ commercialId: string }, CommercialType>('/commercial/:commercialId/'),

  commercialId_proprietaries: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType[]>(
    '/commercial/:commercialId/proprietaries/'
  ),
  commercialId_create_proprietary: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType>(
    '/commercial/:commercialId/create_proprietary/'
  ),
  commercialId_update_proprietary: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType>(
    '/commercial/:commercialId/update_proprietary/'
  ),
  commercialId_delete_proprietary: _createCondominiumUrl<
    { commercialId: string; proprietaryId: string },
    NaturalPersonType
  >('/commercial/:commercialId/delete_proprietary?fk_person=:proprietaryId'),
  commercialId_renters: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType[]>(
    '/commercial/:commercialId/renters/'
  ),
  commercialId_create_renter: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType>(
    '/commercial/:commercialId/create_renter/'
  ),
  commercialId_update_renter: _createCondominiumUrl<{ commercialId: string }, NaturalPersonType>(
    '/commercial/:commercialId/update_renter/'
  ),
  commercialId_delete_renter: _createCondominiumUrl<{ commercialId: string; renterId: string }, NaturalPersonType>(
    '/commercial/:commercialId/delete_renter?fk_person=:renterId'
  ),

  commercialId_create_employee: _createCondominiumUrl<{ commercialId: string }, EmployeeType>(
    '/commercial/:commercialId/create_employee/'
  ),
  commercialId_update_employee: _createCondominiumUrl<{ commercialId: string }, EmployeeType>(
    '/commercial/:commercialId/update_employee/'
  ),
  commercialID_delete_employee: _createCondominiumUrl<{ commercialId: string; employeeId: string }, EmployeeType>(
    '/commercial/:commercialId/delete_employee?employeeId=:employeeId'
  ),
  commercialId_employees: _createCondominiumUrl<{ commercialId: string }, EmployeeType[]>(
    '/commercial/:commercialId/employees/'
  ),
  commercialId_garage: _createCondominiumUrl<{ commercialId: string }, GarageType[]>(
    '/commercial/:commercialId/garage/'
  ),
  reading_item: _createCondominiumUrl<null, ReadingItemType[]>('/reading_item/'),
  reading_itemId: _createCondominiumUrl<{ reading_itemId: string }, ReadingItemType>(
    '/reading_item/:reading_itemId/'
  ),

  measurement_unit: _createCondominiumUrl<null, ReadingItemType[]>('/measurement_unit/'),
  measurement_unitId: _createCondominiumUrl<{ measurement_unitId: string }, ReadingItemType>(
    '/measurement_unit/:measurement_unitId/'
  ),

  uhab: _createCondominiumUrl('/uhab/'),
  uhabId: _createCondominiumUrl<{ uhabId: string }, UhabType>('/uhab/:uhabId/'),
  uhab_user_role: _createCondominiumUrl('/uhab_user_role/'),
  uhab_user_roleId: _createCondominiumUrl<{ uhabUserRoleId: string }, UhabUserRoleType>(
    '/uhab_user_role/:uhabUserRoleId/'
  ),
  uhab_user_roles_by_person: _createCondominiumUrl<
    { personId: string; fk_lookup_type_of_uhab_user_role: string; fk_uhab: string },
    UhabUserRoleType[]
  >(
    '/uhab_user_role/?fk_person=:personId&fk_lookup_type_of_uhab_user_role=:fk_lookup_type_of_uhab_user_role&fk_uhab=:fk_uhab'
  ),

  report_garage: _createCondominiumUrl<{ fk_condominium: string }>('/report/garage/?fk_condominium=:fk_condominium'),
  service: _createCondominiumUrl<null, ServiceType[]>('/service/'),
  serviceId: _createCondominiumUrl<{ serviceId: string }, ServiceType>('/service/:serviceId/'),
  product: _createCondominiumUrl<null, ProductType[]>('/product/'),
  productId: _createCondominiumUrl<{ productId: string }, ProductType>('/product/:productId/'),
  get_supplier_by_identification: _createCondominiumUrl<{ identification: string }, SearchSupplierType>(
    '/supplier/search_supplier_by_identification/?identification=:identification'
  ),
  suppliers: _createCondominiumUrl<null, SupplierType[]>('/supplier/'),
  supplierId: _createCondominiumUrl<{ supplierId: string }, SupplierType>('/supplier/:supplierId/'),
  uhab_ideal_fraction: _createCondominiumUrl<{ fk_ideal_fraction: string }, UhabIdealFractionType[]>(
    '/uhab_ideal_fraction/?fk_ideal_fraction=:fk_ideal_fraction'
  ),
  ideal_fraction: _createCondominiumUrl<null, IdealFractionType[]>('/ideal_fraction/'),
  ideal_fraction_by_id: _createCondominiumUrl<{ idealFractionId: string }, IdealFractionType>(
    '/ideal_fraction/:idealFractionId/'
  ),
  ideal_fraction_by_id_copy: _createCondominiumUrl<{ idealFractionId: string }, IdealFractionType>(
    '/ideal_fraction/:idealFractionId/copy/'
  ),
  ideal_fraction_update_items: _createCondominiumUrl<null, IdealFractionType>('/ideal_fraction_update_items/'),
  apportionment: _createCondominiumUrl('/apportionment/')
}
