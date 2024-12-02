import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import { CityType } from '@typesApiMapping/apps/core/cityTypes'
import { ColorType } from '@typesApiMapping/apps/core/colorTypes'
import { DistrictType } from '@typesApiMapping/apps/core/districtTypes'
import { PostalCodeType } from '@typesApiMapping/apps/core/postalCodeTypes'
import { StateType } from '@typesApiMapping/apps/core/stateTypes'
import { createUrl } from './Url'
import { MeasurementUnitType } from '@typesApiMapping/apps/core/measurementUnitTypes'
import { BankType } from '@typesApiMapping/apps/core/bankTypes'

export const CoreService = {
    address: createUrl<null, AddressType[]>('/core/address/'),
    addressId: createUrl<{ addressId: string }, AddressType>('/core/address/:addressId/'),
    address_by_personId: createUrl<{ personId: string }, AddressType[]>('/core/address?fk_person=:personId'),
    city: createUrl<null, CityType[]>('/core/city/'),
    cityId: createUrl<{ cityId: string }, CityType>('/core/city/:cityId/'),
    color: createUrl<null, ColorType[]>('/core/color/'),
    colorId: createUrl<{ colorId: string }, ColorType>('/core/color/:colorId/'),
    district: createUrl<null, DistrictType[]>('/core/district/'),
    districtId: createUrl<{ districtId: string }, DistrictType>('/core/district/:districtId/'),
    postal_code: createUrl('/core/postal_code/'),
    postal_codeId: createUrl<{ postalCodeId: string }, PostalCodeType>('/core/postal_code/:postalCodeId/'),
    get_postal_codeId_by_postal_code_number: createUrl<null, PostalCodeType[]>('/core/postal_code/'),
    state: createUrl<null, StateType[]>('/core/state/'),
    stateId: createUrl<{ stateId: string }, StateType>('/core/state/:stateId/'),
    measurementUnit: createUrl<null, MeasurementUnitType[]>('/core/measurement_unit/'),
    bank: createUrl<null, BankType[]>('/core/bank/'),
    bankId: createUrl<{ bankId: string }, BankType>('/core/bank/:bankId/'),
}
