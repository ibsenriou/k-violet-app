import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type LookupTypeOfUhabUserRoleEnum = {
    Syndicator: string
    Resident: string
    Renter: string
    Proprietary: string
    Employee: string
}

export type LookupTypeOfUhabUserRoleType = HomespaceBaseModel & {
    description: keyof LookupTypeOfUhabUserRoleEnum
}


// Enumerator for the lookupTypeOfUhabUserRoles if more values are added to the lookupTypeOfUhabUserRoles, they should be added here
export const LOOKUP_TYPE_OF_UHAB_USER_ROLES = {
    Syndicator: 'Syndicator',
    Resident: 'Resident',
    Renter: 'Renter',
    Proprietary: 'Proprietary',
    Employee: 'Employee'
} as const
