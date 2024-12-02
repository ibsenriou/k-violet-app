import { createSlice } from '@reduxjs/toolkit'

import { CondominiumContactInformationType } from '@typesApiMapping/apps/condominium/condominiumContactInformationTypes'
import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'
import { CondominiumType } from '@typesApiMapping/apps/condominium/condominiumTypes'
import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import { PostalCodeType } from '@typesApiMapping/apps/core/postalCodeTypes'
import { LookupTypeOfCondominiumGroupingType } from '@typesApiMapping/apps/lookups/lookupTypeOfCondominiumGroupingTypes'
import { LookupTypeOfContactInformationType } from '@typesApiMapping/apps/lookups/lookupTypeOfContactInformationTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { CoreService } from 'src/services/coreService'
import { LookupsService } from 'src/services/lookupsService'
import { RootState } from 'src/store'

import { createAppAsyncThunk } from 'src/store/utils'

interface DataFetchParams {
    id: string
}

interface AboutTheCondominium {
    condominium: CondominiumType
    typeOfCondominiumGrouping: LookupTypeOfCondominiumGroupingType[]
    typeOfContactInformation: LookupTypeOfContactInformationType[]
    contactInformation: CondominiumContactInformationType[]
    groupings: CondominiumGroupingType[]

    address: AddressType
    cep: PostalCodeType
}

export const fetchData = createAppAsyncThunk('AboutTheCondominium/fetchData', async (params: DataFetchParams) => {
    const [condominium, typeOfCondominiumGrouping, typeOfContactInformation, contactInformation, groupings] =
        await Promise.all([
            await CondominiumService.condominiumId.get({ condominiumId: params['id'] }),
            await LookupsService.lookup_type_of_condominium_grouping.get(),
            await LookupsService.lookup_type_of_contact_information.get(),
            await CondominiumService.condominium_contact_information.get(null, { fk_condominium: params['id'] }),
            await CondominiumService.condominium_grouping.get(null, { fk_uhab: params['id'] })
        ])

    const addressData = await CoreService.addressId.get({ addressId: condominium?.data?.fk_address.toString() })
    const cepData = await CoreService.postal_codeId.get({
        postalCodeId: addressData.data.fk_postal_code
    })

    return {
        condominium: condominium.data,
        typeOfCondominiumGrouping: typeOfCondominiumGrouping.data.results,
        typeOfContactInformation: typeOfContactInformation.data.results,
        contactInformation: contactInformation.data.results,
        groupings: groupings.data.results,
        address: addressData.data,
        cep: cepData.data
    }
})

export const patchDataAboutTheCondominiumInfo = createAppAsyncThunk(
    'AboutTheCondominium/patchDataAboutTheCondominiumInfo',
    async (
        data: {
            id: string
            name?: string
            description?: string
        },
        { dispatch }
    ) => {
        await CondominiumService.condominiumId.patch(
            { condominiumId: data.id },
            {
                name: data.name,
                description: data.description
            }
        )

        dispatch(fetchData({ id: data.id }))
    }
)

export const patchDataAboutTheCondominiumAddress = createAppAsyncThunk(
    'AboutTheCondominium/patchDataAboutTheCondominiumAddress',
    async (
        data: {
            id: string
            street_name: string
            number: string
            complement: string
            fk_postal_code: string
            fk_state: string
            fk_city: string
            fk_district: string | null
            fk_condominium: string
        },
        { dispatch }
    ) => {
        await CoreService.addressId.patch(
            { addressId: data.id },
            {
                street_name: data.street_name,
                number: data.number,
                complement: data.complement,
                fk_postal_code: data.fk_postal_code,
                fk_state: data.fk_state,
                fk_city: data.fk_city,
                fk_district: data.fk_district
            }
        )

        dispatch(fetchData({ id: data.fk_condominium }))
    }
)

export const addAboutTheCondominiumContact = createAppAsyncThunk(
    'AboutTheCondominium/addAboutTheCondominiumContact',
    async (
        data: {
            contact: string
            description: string
            fk_lookup_type_of_contact_information: string
            fk_condominium: string
        },
        { dispatch }
    ) => {
        await CondominiumService.condominium_contact_information.post(
            {},
            {
                contact: data.contact,
                description: data.description,
                fk_lookup_type_of_contact_information: data.fk_lookup_type_of_contact_information,
                fk_condominium: data.fk_condominium
            }
        )

        dispatch(fetchData({ id: data.fk_condominium }))
    }
)

export const updateAboutTheCondominiumContact = createAppAsyncThunk(
    'AboutTheCondominium/updateAboutTheCondominiumContact',
    async (
        data: {
            id: string
            contact: string
            description: string
            fk_lookup_type_of_contact_information: string
            fk_condominium: string
        },
        { dispatch }
    ) => {
        await CondominiumService.condominium_contact_informationId.patch(
            { contactInformationId: data.id },
            {
                contact: data.contact,
                description: data.description,
                fk_lookup_type_of_contact_information: data.fk_lookup_type_of_contact_information,
                fk_condominium: data.fk_condominium
            }
        )

        dispatch(fetchData({ id: data.fk_condominium }))
    }
)

export const deleteAboutTheCondominiumContact = createAppAsyncThunk(
    'AboutTheCondominium/deleteAboutTheCondominiumContact',
    async (data: { id: string; fk_condominium: string }, { dispatch }) => {
        await CondominiumService.condominium_contact_informationId.delete({ contactInformationId: data.id })

        dispatch(fetchData({ id: data.fk_condominium }))
    }
)

export const addAboutTheCondominiumGrouping = createAppAsyncThunk(
    'AboutTheCondominium/addAboutTheCondominiumGrouping',
    async (
        data: {
            name: string
            description: string
            fk_lookup_type_of_condominium_grouping: string
            fk_uhab: string
        },
        { dispatch }
    ) => {
        await CondominiumService.condominium_grouping.post(
            {},
            {
                name: data.name,
                description: data.description,
                fk_lookup_type_of_condominium_grouping: data.fk_lookup_type_of_condominium_grouping,
                fk_uhab: data.fk_uhab
            }
        )

        dispatch(fetchData({ id: data.fk_uhab }))
    }
)

export const updateAboutTheCondominiumGrouping = createAppAsyncThunk(
    'AboutTheCondominium/updateAboutTheCondominiumGrouping',
    async (
        data: {
            id: string
            name: string
            description: string
            fk_lookup_type_of_condominium_grouping: string
            fk_uhab: string
        },
        { dispatch }
    ) => {
        await CondominiumService.condominium_groupingId.patch(
            { groupingId: data.id },
            {
                name: data.name,
                description: data.description,
                fk_lookup_type_of_condominium_grouping: data.fk_lookup_type_of_condominium_grouping,
                fk_uhab: data.fk_uhab
            }
        )

        dispatch(fetchData({ id: data.fk_uhab }))
    }
)

export const deleteAboutTheCondominiumGrouping = createAppAsyncThunk(
    'AboutTheCondominium/deleteAboutTheCondominiumGrouping',
    async (data: { id: string; fk_uhab: string }, { dispatch }) => {
        try {
            await CondominiumService.condominium_groupingId.delete({ groupingId: data.id })
            dispatch(fetchData({ id: data.fk_uhab }))
        } catch (e) {
            console.error(e)
        }
    }
)

export const appCondominiumAboutTheCondominiumSlice = createSlice({
    name: 'AboutTheCondominium',
    initialState: {
        data: <AboutTheCondominium>{},
        total: 1,
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export const selectCondominium = (state: RootState) => state.aboutTheCondominium.data.condominium

export default appCondominiumAboutTheCondominiumSlice.reducer
