import { createSlice } from '@reduxjs/toolkit'

import moment from 'moment'

import { GarageType } from '@typesApiMapping/apps/condominium/garageTypes'
import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'
import { EmployeeType } from '@typesApiMapping/apps/people/employeeTypes'
import { NaturalPersonType } from '@typesApiMapping/apps/people/naturalPersonTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { PeopleService } from 'src/services/peopleService'
import { setContactInformation } from 'src/store/apps/user'
import { createAppAsyncThunk } from 'src/store/utils'

const CPF_LENGTH = 11

interface FetchCommercial {
    id: string | string[]
    commercial: CommercialType
}

interface RentersOrProprietariesDataType {
    id?: string
    name: string
    identification?: string
    national_individual_taxpayer_identification?: string
    date_of_birth?: string | null
    avatar_image_file_name?: File | string | null
    person_contact_information_set?: Partial<PersonContactInformationType>[]
    is_this_the_main_role?: boolean
    uhab_user_role_Id?: string
    fk_lookup_type_of_uhab_user_role?: string
}

interface EmployeeDataType extends RentersOrProprietariesDataType {
    working_week_days: string
}

export const fetchData = createAppAsyncThunk(
    'appCondominiumCommercialDetail/fetchData',
    async (params: { id: string }): Promise<FetchCommercial> => {
        const [commercial] = await Promise.all([CondominiumService.commercialId.get({ commercialId: params['id'] })])

        return {
            id: params['id'],
            commercial: commercial.data,
        }
    }
)

export const addProprietary = createAppAsyncThunk(
  'appCondominiumCommercialDetail/addProprietary',
  async (data: RentersOrProprietariesDataType, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']

      const identification = data.identification?.replace(/\D/g, '')

      const isNaturalPerson = identification?.length == CPF_LENGTH

      // Remove the contact information from the set if description is blank or undefined
      const contactInformationSet = data.person_contact_information_set?.map(contact => {
          if (contact.description === '' || contact.description === undefined) {
              return
          }
          return contact
      }).filter(contact => contact !== undefined)


      const personFormData = isNaturalPerson
          ? {
                name: data.name,
                ... (data.date_of_birth && { date_of_birth: data.date_of_birth }),
                national_individual_taxpayer_identification: identification,
            }
          : {
                name: data.name,
                national_corporate_taxpayer_identification_number: identification,
            }


      const formData = new FormData()
      const formConfig = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }

      formData.append('person', JSON.stringify(personFormData))
      formData.append('is_natural_person', JSON.stringify(isNaturalPerson))
      formData.append('person_contact_information', JSON.stringify(contactInformationSet))
      formData.append('commercial_id', uhabId)


      CondominiumService.commercialId_create_proprietary.post(
          { commercialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const deleteProprietary = createAppAsyncThunk(
'appCondominiumCommercialDetail/deleteProprietary',
async (data: { [key: string]: string }, { getState, dispatch }) => {
    const uhabId = getState().commercialDetail.data.commercial['id']

    await CondominiumService.commercialId_delete_proprietary.delete({
        proprietaryId: data.id,
        commercialId: uhabId
    })

    dispatch(fetchData({ id: uhabId }))
}
)

export const addRenter = createAppAsyncThunk(
  'appCondominiumCommercialDetail/addRenter',
  async (data: RentersOrProprietariesDataType, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']

      const identification = data.identification?.replace(/\D/g, '')

      // Remove the contact information from the set if description is blank or undefined
      const contactInformationSet = data.person_contact_information_set?.map(contact => {
          if (contact.description === '' || contact.description === undefined) {
              return
          }
          return contact
      }).filter(contact => contact !== undefined)

      const isThisTheMainRole = data.is_this_the_main_role

      const personFormData = {
        name: data.name,
        ... (data.date_of_birth && { date_of_birth: data.date_of_birth }),
        national_individual_taxpayer_identification: identification,
      }


      const formData = new FormData()
      const formConfig = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }

      formData.append('person', JSON.stringify(personFormData))
      formData.append('is_this_the_main_role', JSON.stringify(isThisTheMainRole))
      formData.append('person_contact_information', JSON.stringify(contactInformationSet))
      formData.append('commercial_id', uhabId)


      CondominiumService.commercialId_create_renter.post(
          { commercialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const updateRenter = createAppAsyncThunk(
  'appCondominiumCommercialDetail/updateRenter',
  async (data: RentersOrProprietariesDataType, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']



      const isThisTheMainRole = data.is_this_the_main_role
      const personId = data.id

      const formData = {
          fk_uhab: uhabId,
          fk_person: personId,
          is_this_the_main_role: isThisTheMainRole
      }

      CondominiumService.commercialId_update_renter.patch(
          { commercialId: uhabId },
          formData,
      )
  }
)

export const deleteRenter = createAppAsyncThunk(
    'appCondominiumCommercialDetail/deleteRenter',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().commercialDetail.data.commercial['id']

        await CondominiumService.commercialId_delete_renter.delete({
          renterId: data.id,
          commercialId: uhabId
        })

        dispatch(fetchData({ id: uhabId }))
    }
)


export const addEmployee = createAppAsyncThunk(
  'appCondominiumCommercialDetail/addEmployee',
  async (data: EmployeeDataType, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']

      const identification = data.national_individual_taxpayer_identification?.replace(/\D/g, '')

      // Remove the contact information from the set if description is blank or undefined
      const contactInformationSet = data.person_contact_information_set?.map(contact => {
          if (contact.description === '' || contact.description === undefined) {
              return
          }
          return contact
      }).filter(contact => contact !== undefined)


      const personFormData = {
        name: data.name,
        ... (data.date_of_birth && { date_of_birth: data.date_of_birth }),
        national_individual_taxpayer_identification: identification,
        working_week_days: data.working_week_days
      }


      const formData = new FormData()
      const formConfig = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }

      formData.append('person', JSON.stringify(personFormData))
      formData.append('person_contact_information', JSON.stringify(contactInformationSet))
      formData.append('commercial_id', uhabId)


      CondominiumService.commercialId_create_employee.post(
          { commercialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const updateEmployee = createAppAsyncThunk(
  'appCondominiumCommercialDetail/updateEmployee',
  async (data: EmployeeDataType, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']

      const identification = data.national_individual_taxpayer_identification?.replace(/\D/g, '')

      // Remove the contact information from the set if description is blank or undefined
      const contactInformationSet = data.person_contact_information_set?.map(contact => {
          if (contact.description === '' || contact.description === undefined) {
              return
          }
          return contact
      }).filter(contact => contact !== undefined)


      const personFormData = {
        id: data.id,
        name: data.name,
        ... (data.date_of_birth && { date_of_birth: data.date_of_birth }),
        national_individual_taxpayer_identification: identification,
        working_week_days: data.working_week_days
      }


      const formData = new FormData()
      const formConfig = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }

      formData.append('person', JSON.stringify(personFormData))
      formData.append('commercial_id', uhabId)


      CondominiumService.commercialId_update_employee.patch(
          { commercialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const deleteEmployee = createAppAsyncThunk(
  'appCondominiumCommercialDetail/deleteEmployee',
  async (data: { [key: string]: string }, { getState, dispatch }) => {
      const uhabId = getState().commercialDetail.data.commercial['id']

      await CondominiumService.commercialID_delete_employee.delete({
        employeeId: data.id,
        commercialId: uhabId
      })

      dispatch(fetchData({ id: uhabId }))
  }
)

export const addGarage = createAppAsyncThunk(
    'appCondominiumCommercialDetail/addGarage',
    async (data: Partial<GarageType>, { getState, dispatch }) => {
        const uhabId = getState().commercialDetail.data.commercial['id']

        const response = await CondominiumService.garage.post(null, {
            name: data.name,
            description: data.description,
            number_of_spots: data.number_of_spots,
            is_garage_being_used: data.is_garage_being_used,
            is_garage_available_for_rent: data.is_garage_available_for_rent,
            is_drawer_type_garage: data.is_drawer_type_garage,
            is_covered_type_garage: data.is_covered_type_garage,
            fk_uhab: uhabId
        })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const updateGarage = createAppAsyncThunk(
    'appCondominiumCommercialDetail/updateGarage',
    async (data: Partial<GarageType>, { getState, dispatch }) => {
        const uhabId = getState().commercialDetail.data.commercial['id']

        const response = await CondominiumService.garageId.patch(
            { garageId: data.id! },
            {
                name: data.name,
                description: data.description,
                number_of_spots: data.number_of_spots,
                is_garage_being_used: data.is_garage_being_used,
                is_garage_available_for_rent: data.is_garage_available_for_rent,
                is_drawer_type_garage: data.is_drawer_type_garage,
                is_covered_type_garage: data.is_covered_type_garage,
                fk_uhab: uhabId
            }
        )

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const deleteGarage = createAppAsyncThunk(
    'appCondominiumCommercialDetail/deleteGarage',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().commercialDetail.data.commercial['id']

        const response = await CondominiumService.garageId.delete({ garageId: data.id })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const appCondominiumCommercialDetailSlice = createSlice({
    name: 'appCondominiumCommercialDetail',
    initialState: {
        data: <FetchCommercial>{},
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

export default appCondominiumCommercialDetailSlice.reducer
