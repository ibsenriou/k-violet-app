import { createSlice } from '@reduxjs/toolkit'

import { useAppSelector } from 'src/store'

import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'
import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'
import { LookupTypeOfCondominiumGroupingType } from '@typesApiMapping/apps/lookups/lookupTypeOfCondominiumGroupingTypes'
import { LookupTypeOfResidentialType } from '@typesApiMapping/apps/lookups/lookupTypeOfResidentialTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { LookupsService } from 'src/services/lookupsService'

import { createAppAsyncThunk } from 'src/store/utils'

import { selectCondominiumId } from '../../user'

import { v4 as uuidv4 } from 'uuid'
import { LOOKUP_TYPE_OF_UHAB_USER_ROLES } from '@typesApiMapping/apps/lookups/lookupTypeOfUhabUserRoleTypes'

// This will ignore TS eslint unused vars warning for now.
//eslint-disable-next-line
export const fetchData = createAppAsyncThunk(
    'appCondominiumResidentials/fetchData',
    async (condominiumId: string | undefined, { getState }) => {
        if (!condominiumId) {
            condominiumId = selectCondominiumId(getState())
        }

        const [
            residentials,
            residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator,
            condominiumGroupings,
            fk_lookup_type_of_residential,
            condominium,
            fk_lookup_type_of_condominium_grouping
        ] = await Promise.all([
            CondominiumService.condominiumId_residential.get({ condominiumId: condominiumId }),
            CondominiumService.condominiumId_residential_by_role.get({
                condominiumId: condominiumId,
                role_description: LOOKUP_TYPE_OF_UHAB_USER_ROLES.Resident
            }),

            CondominiumService.condominiumId_condominium_grouping.get({ condominiumId: condominiumId }),

            LookupsService.lookup_type_of_residential.get(),

            // As informações do condominio precisam ser carregadas pois o formulário de cadastro de residenciais precisa ter um campo para selecionar o agrupamento e esse dado pode ser também o condominio em si.
            CondominiumService.condominiumId.get({ condominiumId: condominiumId }),
            LookupsService.lookup_type_of_condominium_grouping.get()

        ])

        // Build the condominiumGroupings appending the condominium itself to the list as the first option

        const RANDOM_ID = uuidv4() // This will not be used in the backend, it's just a random number to be used as a key in the select component to stop TS complaining about the key not being present.

        condominiumGroupings.data.results.unshift({
            ...condominium.data,
            fk_lookup_type_of_condominium_grouping: RANDOM_ID
        })

        return {
            residentials: residentials.data.results,
            residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator: residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator.data.results,
            condominiumGroupings: condominiumGroupings.data.results,
            fk_lookup_type_of_residential: fk_lookup_type_of_residential.data.results,
            fk_lookup_type_of_condominium_grouping: fk_lookup_type_of_condominium_grouping.data.results
        }
    }
)

export const addResidential = createAppAsyncThunk(
    'appCondominiumResidential/addResidential',
    async (data: Partial<ResidentialType>, { getState, dispatch }) => {
        const condominiumId = selectCondominiumId(getState())
        await CondominiumService.residential.post(null, {
            name: data.name,
            description: data.description,
            fk_uhab: data.fk_uhab,
            fk_lookup_type_of_residential: data.fk_lookup_type_of_residential
        })

        dispatch(fetchData(condominiumId))
    }
)

export const updateResidential = createAppAsyncThunk(
    'appCondominiumResidential/updateResidential',
    async (data: Partial<ResidentialType>, { getState, dispatch }) => {
        const condominiumId = selectCondominiumId(getState())

        await CondominiumService.residentialId.patch(
            { residentialId: data.id! },
            {
                name: data.name,
                description: data.description,
                fk_uhab: data.fk_uhab,
                fk_lookup_type_of_residential: data.fk_lookup_type_of_residential
            }
        )

        dispatch(fetchData(condominiumId))
    }
)

export const deleteResidential = createAppAsyncThunk(
    'appCondominiumResidential/deleteResidential',
    async (data: { id: string }, { getState, dispatch }) => {
        await CondominiumService.residentialId.delete({ residentialId: data.id })

        dispatch(fetchData(selectCondominiumId(getState())))
    }
)

export const useFindResidentialGroupName = () => {
    const { residentials, condominiumGroupings, fk_lookup_type_of_condominium_grouping } = useAppSelector(
        state => state.residentials
    )
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    return (residentialId: string) => {
        const residential = residentials.find(residential => residential.id === residentialId)
        if (!residential) {
            return ''
        }

        if (residential.fk_uhab == condominium?.id) {
            return condominium.name
        }

        const condominiumGrouping = condominiumGroupings.find(
            condominiumGrouping => condominiumGrouping.id === residential.fk_uhab
        )
        if (!condominiumGrouping) {
            return ''
        }

        const lookupTypeOfCondominiumGrouping = fk_lookup_type_of_condominium_grouping.find(
            lookupTypeOfCondominiumGrouping =>
                lookupTypeOfCondominiumGrouping.id === condominiumGrouping.fk_lookup_type_of_condominium_grouping
        )
        if (!lookupTypeOfCondominiumGrouping) {
            return ''
        }

        return lookupTypeOfCondominiumGrouping.description + ' ' + condominiumGrouping.name
    }
}

export const appCondominiumResidentialSlice = createSlice({
    name: 'appCondominiumResidential',
    initialState: {
        residentials: <ResidentialType[]>[],
        residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator: <ResidentialType[]>[],
        condominiumGroupings: <CondominiumGroupingType[]>[],
        fk_lookup_type_of_residential: <LookupTypeOfResidentialType[]>[],
        fk_lookup_type_of_condominium_grouping: <LookupTypeOfCondominiumGroupingType[]>[]
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.residentials = action.payload.residentials
            state.residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator =
                action.payload.residentialsWhereUserHasResidentRoleOrAllIfRoleIsSyndicator
            state.condominiumGroupings = action.payload.condominiumGroupings
            state.fk_lookup_type_of_residential = action.payload.fk_lookup_type_of_residential
            state.fk_lookup_type_of_condominium_grouping = action.payload.fk_lookup_type_of_condominium_grouping
        })
    }
})

export default appCondominiumResidentialSlice.reducer
