import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from 'src/store'
import { checkMatchType, createAppAsyncThunk } from 'src/store/utils'

import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import { PostalCodeType } from '@typesApiMapping/apps/core/postalCodeTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'
import type { NaturalPersonType } from 'src/@typesApiMapping/apps/people/naturalPersonTypes'
import type { UserType } from 'src/@typesApiMapping/apps/userTypes'

import { CoreService } from 'src/services/coreService'
import { PeopleService } from 'src/services/peopleService'
import { fetchData as fetchAboutTheCondominium } from '../condominium/about-the-condominium'

import { displayToast } from 'src/views/utils/displayToast'
import { AuthService } from 'src/services/authService'

type FetchDataParams = {
    user?: UserType
}
export const fetchData = createAppAsyncThunk(
    'appUsers/fetchData',
    async ({ user: _user }: FetchDataParams, { dispatch, getState }) => {
        const user = _user || getState().auth.user!

        const personResult = await PeopleService.natural_person.get(null, { fk_user: user.id })

        const personId = personResult.data.results[0].id.toString()
        const contactInformation = await PeopleService.person_contact_information_by_personId.get({
            personId: personId
        })

        dispatch(fetchAddressData(personId))
        dispatch(fetchAboutTheCondominium({ id: user.user_roles[0].fk_condominium }))

        return { user, natualPerson: personResult.data.results[0], contactInformation: contactInformation.data.results }
    }
)

export const fetchContactInformation = createAppAsyncThunk(
    'appUsers/fetchContactInformation',
    async (_, { getState }) => {
        const user = getState().auth.user!

        const personResult = await PeopleService.natural_person.get(null, { fk_user: user.id })

        const personId = personResult.data.results[0].id.toString()

        const { data: contactInformation } = await PeopleService.person_contact_information_by_personId.get({
            personId: personId
        })

        return contactInformation.results
    }
)

export const fetchAddressData = createAppAsyncThunk(
    'appUsers/fetchAddressData',
    async (personId: string, { dispatch }) => {
        const { data: addressData } = await CoreService.address_by_personId.get({
            personId: personId
        })

        if (addressData.results.length === 0) {
            return null
        }

        dispatch(fetchCepData(addressData.results[0].fk_postal_code))

        return addressData.results[0]
    }
)

export const fetchCepData = createAppAsyncThunk('appUsers/fetchCepData', async (cep: string) => {
    const { data: cepData } = await CoreService.postal_codeId.get({ postalCodeId: cep })

    return cepData
})

export const updateNaturalPerson = createAppAsyncThunk(
    'appUsers/updateNaturalPerson',
    async (data: NaturalPersonType, {}) => {
        const natural_person = await PeopleService.natural_personId.patch(
            { naturalPersonId: data.id },
            {
                name: data.name,
                date_of_birth: data.date_of_birth,
                has_natural_person_given_permission_to_use_his_image:
                    data.has_natural_person_given_permission_to_use_his_image,
                image: data.image
            }
        )

        return natural_person.data
    }
)

export const updateAddress = createAppAsyncThunk(
    'appUsers/updateAddress',
    async (data: Partial<AddressType>, { dispatch, getState }) => {
        const natualPerson = (getState() as RootState).user.natualPerson

        if (data.fk_postal_code) {
            dispatch(fetchCepData(data.fk_postal_code))
        }

        if (data.id) {
            const response = await CoreService.addressId.patch(
                { addressId: data.id.toString() },
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
            return response.data
        } else {
            const response = await CoreService.address.post(null, {
                street_name: data.street_name,
                number: data.number,
                complement: data.complement,
                fk_postal_code: data.fk_postal_code,
                fk_state: data.fk_state,
                fk_city: data.fk_city,
                fk_district: data.fk_district,
                fk_person: natualPerson.id
            })
            return response.data
        }
    }
)

export const addContactInformation = createAppAsyncThunk(
    'appUsers/addContactInformation',
    async (data: Partial<PersonContactInformationType>, {}) => {
        const contact_information = await PeopleService.person_contact_information.post(null, {
            description: data.description,
            fk_person: data.fk_person,
            fk_lookup_type_of_contact_information: data.fk_lookup_type_of_contact_information
        })

        return contact_information.data
    }
)

export const updateContactInformation = createAppAsyncThunk(
    'appUsers/updateContactInformation',
    async (data: Partial<PersonContactInformationType>, {}) => {
        const contact_information = await PeopleService.person_contact_informationId.patch(
            { contactInformationId: data.id!.toString() },
            {
                description: data.description,
                fk_lookup_type_of_contact_information: data.fk_lookup_type_of_contact_information
            }
        )

        return contact_information.data
    }
)

export const deleteContactInformation = createAppAsyncThunk(
    'appUsers/deleteContactInformation',
    async (data: any, {}) => {
        const contact_information = await PeopleService.person_contact_informationId.delete({
            contactInformationId: data.id.toString()
        })

        return data
    }
)

export const changePassword = createAppAsyncThunk(
  'appUsers/changePassword',
  async (data: { current_password: string; new_password: string; confirm_password: string }, { dispatch, getState }) => {
    // Validate if current password is correct
    const confirmPasswordResponse = await AuthService.login.post(null, {
      username: (getState() as RootState).auth.user!.email,
      password: data.current_password
    })

    if (confirmPasswordResponse.status !== 200) {
      return false
    }

    await AuthService.password_change.post(null, {
      new_password2: data.confirm_password,
      new_password1: data.new_password
    })

    return true
  }
)

export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState: {
        natualPerson: <NaturalPersonType>{},
        address: (<AddressType>{}) as AddressType | null,
        cep: <PostalCodeType>{},
        contactInformation: [] as PersonContactInformationType[],
        loading: false
    },
    reducers: {
        setContactInformation: (state, action) => {
            const index = state.contactInformation.findIndex(
                contactInformation => contactInformation.id === action.payload.data.id
            )
            if (index === -1) {
                state.contactInformation.push(action.payload.data)
            } else {
                state.contactInformation[index] = action.payload.data
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.natualPerson = action.payload.natualPerson
            state.contactInformation = action.payload.contactInformation
        })
        builder.addCase(fetchCepData.fulfilled, (state, action) => {
            state.cep = action.payload
        })
        builder.addCase(fetchAddressData.fulfilled, (state, action) => {
            state.address = action.payload
        })

        builder.addCase(updateNaturalPerson.fulfilled, (state, action) => {
            state.natualPerson = action.payload
        })
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            state.address = action.payload
        })
        builder.addCase(addContactInformation.fulfilled, (state, action) => {
            const index = state.contactInformation.findIndex(
                contactInformation => contactInformation.id === action.payload.id
            )
            if (index !== -1) state.contactInformation[index] = action.payload
            if (index === -1) state.contactInformation.push(action.payload)
        })
        builder.addCase(updateContactInformation.fulfilled, (state, action) => {
            const index = state.contactInformation.findIndex(
                contactInformation => contactInformation.id === action.payload.id
            )
            state.contactInformation[index] = action.payload
        })
        builder.addCase(deleteContactInformation.fulfilled, (state, action) => {
            const index = state.contactInformation.findIndex(
                contactInformation => contactInformation.id === action.payload.id
            )
            state.contactInformation.splice(index, 1)
        })

        builder.addMatcher(checkMatchType('appUsers', 'pending'), state => {
            state.loading = true
        })
        builder.addMatcher(checkMatchType('appUsers', 'fulfilled'), state => {
            state.loading = false
        })
        builder.addMatcher(checkMatchType('appUsers', 'rejected'), state => {
            state.loading = false
            displayToast({
                error: 'error'
            })
        })
    }
})

export const selectUser = (state: RootState) => (state.auth.user!.id ? state.auth.user : null)
export const selectUserNatualPerson = (state: RootState) => state.user.natualPerson

export const selectUserLoading = (state: RootState) => state.user.loading
export const selectUserAddress = (state: RootState) => state.user.address
export const selectUserCep = (state: RootState) => state.user.cep
export const selectUserContactInformation = (state: RootState) => state.user.contactInformation
export const selectUserEmailInformation = (state: RootState) =>
    state.user.contactInformation.find(contactInformation => contactInformation.description === 'E-mail')
export const selectCondominiumId = (state: RootState) => state.auth.user!.user_roles[0].fk_condominium

export default appUsersSlice.reducer
export const { setContactInformation } = appUsersSlice.actions
