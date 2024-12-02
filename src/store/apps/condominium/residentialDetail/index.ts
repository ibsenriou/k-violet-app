import { createSlice } from '@reduxjs/toolkit'

import moment from 'moment'

import { GarageType } from '@typesApiMapping/apps/condominium/garageTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { EmployeeType } from '@typesApiMapping/apps/people/employeeTypes'
import { NaturalPersonType } from '@typesApiMapping/apps/people/naturalPersonTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'
import { PetType } from '@typesApiMapping/apps/pets/petTypes'
import { VehicleType } from '@typesApiMapping/apps/vehicles/vehicleTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { PeopleService } from 'src/services/peopleService'
import { PetsService } from 'src/services/petsService'
import { VehiclesService } from 'src/services/vehiclesService'

import { setContactInformation } from 'src/store/apps/user'
import { createAppAsyncThunk } from 'src/store/utils'

const CPF_LENGTH = 11

interface FetchResidential {
    id: string | string[]
    residential: ResidentialType
}

interface ResidentsOrProprietariesDataType {
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

interface EmployeeDataType extends ResidentsOrProprietariesDataType {
    working_week_days: string
}

export const fetchData = createAppAsyncThunk(
    'appCondominiumResidentialDetail/fetchData',
    async (params: { id: string }): Promise<FetchResidential> => {
        const [residential] = await Promise.all([CondominiumService.residentialId.get({ residentialId: params['id'] })])

        return {
            id: params['id'],
            residential: residential.data
        }
    }
)

export const addProprietary = createAppAsyncThunk(
    'appCondominiumResidentialDetail/addProprietary',
    async (data: ResidentsOrProprietariesDataType, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

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
        formData.append('residential_id', uhabId)


        CondominiumService.residentialId_create_proprietary.post(
            { residentialId: uhabId },
            formData,
            formConfig
        )

        dispatch(fetchData({ id: uhabId }))
    }
)

export const deleteProprietary = createAppAsyncThunk(
  'appCondominiumResidentialDetail/deleteProprietary',
  async (data: { [key: string]: string }, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']

      await CondominiumService.residentialId_delete_proprietary.delete({
          personId: data.id,
          residentialId: uhabId
      })

      dispatch(fetchData({ id: uhabId }))
  }
)

export const addResident = createAppAsyncThunk(
  'appCondominiumResidentialDetail/addResident',
  async (data: ResidentsOrProprietariesDataType, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']

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
      formData.append('residential_id', uhabId)


      CondominiumService.residentialId_create_resident.post(
          { residentialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const updateResident = createAppAsyncThunk(
  'appCondominiumResidentialDetail/updateResident',
  async (data: ResidentsOrProprietariesDataType, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']



      const isThisTheMainRole = data.is_this_the_main_role
      const personId = data.id

      const formData = {
          fk_uhab: uhabId,
          fk_person: personId,
          is_this_the_main_role: isThisTheMainRole
      }

      CondominiumService.residentialId_update_resident.patch(
          { residentialId: uhabId },
          formData,
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const deleteResident = createAppAsyncThunk(
    'appCondominiumResidentialDetail/deleteResident',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        await CondominiumService.residentialId_delete_resident.delete({
          residentId: data.id,
          residentialId: uhabId
        })

        dispatch(fetchData({ id: uhabId }))
    }
)


export const addEmployee = createAppAsyncThunk(
  'appCondominiumResidentialDetail/addEmployee',
  async (data: EmployeeDataType, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']

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
      formData.append('residential_id', uhabId)


      CondominiumService.residentialId_create_employee.post(
          { residentialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const updateEmployee = createAppAsyncThunk(
  'appCondominiumResidentialDetail/updateEmployee',
  async (data: EmployeeDataType, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']

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
      formData.append('residential_id', uhabId)


      CondominiumService.residentialId_update_employee.patch(
          { residentialId: uhabId },
          formData,
          formConfig
      )

      dispatch(fetchData({ id: uhabId }))
  }
)

export const deleteEmployee = createAppAsyncThunk(
  'appCondominiumResidentialDetail/deleteEmployee',
  async (data: { [key: string]: string }, { getState, dispatch }) => {
      const uhabId = getState().residentialDetail.data.residential['id']

      await CondominiumService.residentialId_delete_employee.delete({
        employeeId: data.id,
        residentialId: uhabId
      })

      dispatch(fetchData({ id: uhabId }))
  }
)

export const addGarage = createAppAsyncThunk(
    'appCondominiumResidentialDetail/addGarage',
    async (data: Partial<GarageType>, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

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
    'appCondominiumResidentialDetail/updateGarage',
    async (data: Partial<GarageType>, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

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
    'appCondominiumResidentialDetail/deleteGarage',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const response = await CondominiumService.garageId.delete({ garageId: data.id })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const addVehicle = createAppAsyncThunk(
    'appCondominiumResidentialDetail/addVehicle',
    async (data: Partial<VehicleType>, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const response = await VehiclesService.vehicle.post(null, {
            vehicle_plate: data.vehicle_plate,
            manufacturing_year: data.manufacturing_year,
            fk_vehicle_model: data.fk_vehicle_model,
            fk_color: data.fk_color,
            fk_residential: uhabId
        })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const updateVehicle = createAppAsyncThunk(
    'appCondominiumResidentialDetail/updateVehicle',
    async (data: Partial<VehicleType>, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const response = await VehiclesService.vehicleId.patch(
            { vehicleId: data.id! },
            {
                vehicle_plate: data.vehicle_plate,
                manufacturing_year: data.manufacturing_year,
                fk_vehicle_model: data.fk_vehicle_model,
                fk_color: data.fk_color,
                fk_residential: uhabId
            }
        )

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const deleteVehicle = createAppAsyncThunk(
    'appCondominiumResidentialDetail/deleteVehicle',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const response = await VehiclesService.vehicleId.delete({ vehicleId: data.id })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const addPet = createAppAsyncThunk(
    'appCondominiumResidentialDetail/addPet',
    async (data: PetType, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const formData = new FormData()
        data.image && formData.append('imagem', data.image)
        formData.append('name', data.name)
        formData.append('fk_animal_breed', data.fk_animal_breed)
        data.fk_animal_size && data.fk_animal_size !== '' && formData.append('fk_animal_size', data.fk_animal_size)
        data.fk_animal_color && data.fk_animal_color !== '' && formData.append('fk_animal_color', data.fk_animal_color)
        formData.append('fk_residential', uhabId)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        await PetsService.pet.post(null, formData, config)

        dispatch(fetchData({ id: uhabId }))
    }
)

export const updatePet = createAppAsyncThunk(
    'appCondominiumResidentialDetail/updatePet',
    async (data: PetType, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const formData = new FormData()
        data.image && formData.append('imagem', data.image)
        formData.append('name', data.name)

        if (data.fk_animal_breed !== '' && data.fk_animal_breed) {
            formData.append('fk_animal_breed', data.fk_animal_breed)
        }

        data.fk_animal_size && data.fk_animal_size !== '' && formData.append('fk_animal_size', data.fk_animal_size)
        data.fk_animal_color && data.fk_animal_color !== '' && formData.append('fk_animal_color', data.fk_animal_color)
        formData.append('fk_residential', uhabId)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        await PetsService.petId.patch({ petId: data.id }, formData, config)

        dispatch(fetchData({ id: uhabId }))
    }
)

export const deletePet = createAppAsyncThunk(
    'appCondominiumResidentialDetail/deletePet',
    async (data: { [key: string]: string }, { getState, dispatch }) => {
        const uhabId = getState().residentialDetail.data.residential['id']

        const response = await PetsService.petId.delete({ petId: data.id })

        dispatch(fetchData({ id: uhabId }))

        return response.data
    }
)

export const appCondominiumResidentialDetailSlice = createSlice({
    name: 'appCondominiumResidentialDetail',
    initialState: {
        data: <FetchResidential>{},
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

export default appCondominiumResidentialDetailSlice.reducer
