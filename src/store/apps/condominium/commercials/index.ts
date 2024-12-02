import { createSlice } from '@reduxjs/toolkit'

import { useAppSelector } from 'src/store'

import { CondominiumGroupingType } from '@typesApiMapping/apps/condominium/condominiumGroupingTypes'
import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'
import { LookupTypeOfCondominiumGroupingType } from '@typesApiMapping/apps/lookups/lookupTypeOfCondominiumGroupingTypes'
import { LookupTypeOfCommercialType } from '@typesApiMapping/apps/lookups/lookupTypeOfCommercialTypes'

import { CondominiumService } from 'src/services/condominiumService'
import { LookupsService } from 'src/services/lookupsService'

import { createAppAsyncThunk } from 'src/store/utils'

import { selectCondominiumId } from '../../user'

import { v4 as uuidv4 } from 'uuid'
import { LOOKUP_TYPE_OF_UHAB_USER_ROLES } from '@typesApiMapping/apps/lookups/lookupTypeOfUhabUserRoleTypes'

// This will ignore TS eslint unused vars warning for now.
//eslint-disable-next-line
export const fetchData = createAppAsyncThunk(
    'appCondominiumCommercials/fetchData',
    async (condominiumId: string | undefined, { getState }) => {
        if (!condominiumId) {
            condominiumId = selectCondominiumId(getState())
        }

        const [
            commercials,
            commercialsWhereUserHasRenterRole,
            condominiumGroupings,
            fk_lookup_type_of_commercial,
            condominium,
            fk_lookup_type_of_condominium_grouping
        ] = await Promise.all([
            CondominiumService.condominiumId_commercial.get({ condominiumId: condominiumId }),
            CondominiumService.condominiumId_commercial_by_role.get({
              condominiumId: condominiumId, role_description: LOOKUP_TYPE_OF_UHAB_USER_ROLES.Renter
            }),
            CondominiumService.condominiumId_condominium_grouping.get({ condominiumId: condominiumId }),

            LookupsService.lookup_type_of_commercial.get(),

            // As informações do condominio precisam ser carregadas pois o formulário de cadastro de Commercials precisa ter um campo para selecionar o agrupamento e esse dado pode ser também o condominio em si.
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
            commercials: commercials.data.results,
            commercialsWhereUserHasRenterRole: commercialsWhereUserHasRenterRole.data.results,
            condominiumGroupings: condominiumGroupings.data.results,
            fk_lookup_type_of_commercial: fk_lookup_type_of_commercial.data.results,
            fk_lookup_type_of_condominium_grouping: fk_lookup_type_of_condominium_grouping.data.results
        }
    }
)

export const addCommercial = createAppAsyncThunk(
    'appCondominiumCommercial/addCommercial',
    async (data: Partial<CommercialType>, { getState, dispatch }) => {
        const condominiumId = selectCondominiumId(getState())
        await CondominiumService.commercial.post(null, {
            name: data.name,
            description: data.description,
            fk_uhab: data.fk_uhab,
            fk_lookup_type_of_commercial: data.fk_lookup_type_of_commercial
        })

        dispatch(fetchData(condominiumId))
    }
)

export const updateCommercial = createAppAsyncThunk(
    'appCondominiumCommercial/updateCommercial',
    async (data: Partial<CommercialType>, { getState, dispatch }) => {
        const condominiumId = selectCondominiumId(getState())

        await CondominiumService.commercialId.patch(
            { commercialId: data.id! },
            {
                name: data.name,
                description: data.description,
                fk_uhab: data.fk_uhab,
                fk_lookup_type_of_commercial: data.fk_lookup_type_of_commercial
            }
        )

        dispatch(fetchData(condominiumId))
    }
)

export const deleteCommercial = createAppAsyncThunk(
    'appCondominiumCommercial/deleteCommercial',
    async (data: { id: string }, { getState, dispatch }) => {
        await CondominiumService.commercialId.delete({ commercialId: data.id })

        dispatch(fetchData(selectCondominiumId(getState())))
    }
)

export const useFindCommercialGroupName = () => {
    const { commercials, condominiumGroupings, fk_lookup_type_of_condominium_grouping } = useAppSelector(
        state => state.commercials
    )
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    return (commercialId: string) => {
        const commercial = commercials.find(commercial => commercial.id === commercialId)
        if (!commercial) {
            return ''
        }

        if (commercial.fk_uhab == condominium?.id) {
            return condominium.name
        }

        const condominiumGrouping = condominiumGroupings.find(
            condominiumGrouping => condominiumGrouping.id === commercial.fk_uhab
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

export const appCondominiumCommercialSlice = createSlice({
    name: 'appCondominiumCommercial',
    initialState: {
        commercials: <CommercialType[]>[],
        commercialsWhereUserHasRenterRole: <CommercialType[]>[],
        condominiumGroupings: <CondominiumGroupingType[]>[],
        fk_lookup_type_of_commercial: <LookupTypeOfCommercialType[]>[],
        fk_lookup_type_of_condominium_grouping: <LookupTypeOfCondominiumGroupingType[]>[]
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.commercials = action.payload.commercials
            state.commercialsWhereUserHasRenterRole = action.payload.commercialsWhereUserHasRenterRole
            state.condominiumGroupings = action.payload.condominiumGroupings
            state.fk_lookup_type_of_commercial = action.payload.fk_lookup_type_of_commercial
            state.fk_lookup_type_of_condominium_grouping = action.payload.fk_lookup_type_of_condominium_grouping
        })
    }
})

export default appCondominiumCommercialSlice.reducer
