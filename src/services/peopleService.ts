import { UhabUserRoleType } from '@typesApiMapping/apps/condominium/uhabUserRoleTypes'
import { EmployeeType } from '@typesApiMapping/apps/people/employeeTypes'
import { LegalPersonType } from '@typesApiMapping/apps/people/legalPersonTypes'
import { NaturalPersonType } from '@typesApiMapping/apps/people/naturalPersonTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'
import { PersonType } from '@typesApiMapping/apps/people/personTypes'
import { createUrl } from './Url'
import { CondominiumService } from './condominiumService'

export const PeopleService = {
    employee: createUrl('/people/employee/'),
    employeeId: createUrl<{ employeeId: string }, EmployeeType>('/people/employee/:employeeId/'),
    employee_by_national_corporate_taxpayer_identification_number: createUrl<null, EmployeeType[]>('/people/employee/'),
    legal_person: createUrl('/people/legal_person/'),
    legal_personId: createUrl<{ legalPersonId: string }, LegalPersonType>('/people/legal_person/:legalPersonId/'),
    legal_person_by_national_corporate_taxpayer_identification_number: createUrl<null, LegalPersonType[]>(
        '/people/legal_person'
    ),
    natural_person: createUrl('/people/natural_person/'),
    natural_personId: createUrl<{ naturalPersonId: string }, NaturalPersonType>(
        '/people/natural_person/:naturalPersonId/'
    ),
    natural_person_by_national_individual_taxpayer_identification: createUrl<null, NaturalPersonType[]>(
        '/people/natural_person'
    ),
    person: createUrl<null, PersonType[]>('/people/person/'),
    personId: createUrl<{ personId: string }, PersonType>('/people/person/:personId/'),
    person_contact_information: createUrl<null, PersonContactInformationType[]>('/people/person_contact_information/'),
    person_contact_information_by_personId: createUrl<{ personId: string }, PersonContactInformationType[]>(
        '/people/person_contact_information?fk_person=:personId'
    ),
    person_contact_informationId: createUrl<{ contactInformationId: string }, PersonContactInformationType>(
        '/people/person_contact_information/:contactInformationId/'
    ),
    report: createUrl<{ type: string; fk_condominium: string }, any[]>(
        '/people/report/?type=:type&fk_condominium=:fk_condominium'
    ),
    get_person_data_by_identification: createUrl(
        async ({ identification }: { identification: string }): Promise<NaturalPersonType | LegalPersonType | null> => {
            if (!identification) {
                return null
            }

            let identificationFound

            if (identification?.length == 11) {
                identificationFound =
                    await PeopleService.natural_person_by_national_individual_taxpayer_identification.get(null, {
                        national_individual_taxpayer_identification: identification ?? ''
                    })
            } else if (identification?.length == 14) {
                identificationFound =
                    await PeopleService.legal_person_by_national_corporate_taxpayer_identification_number.get(null, {
                        national_corporate_taxpayer_identification_number: identification ?? ''
                    })
            }

            return identificationFound?.data?.results?.length ? identificationFound.data.results[0] : null
        }
    ),

    get_person_and_active_uhab_user_role_by_uhab_user_role_and_person_identification: createUrl(
        async ({
            identification,
            fk_lookup_type_of_uhab_user_role,
            fk_uhab,
            employee
        }: {
            identification: string
            fk_lookup_type_of_uhab_user_role: string
            fk_uhab: string
            employee?: boolean
        }): Promise<{
            person: NaturalPersonType | LegalPersonType | EmployeeType | null
            user_role: UhabUserRoleType | null
        }> => {
            if (!identification) {
                return { person: null, user_role: null }
            }

            let identificationFound

            if (identification?.length == 11) {
                if (employee) {
                    identificationFound =
                        await PeopleService.employee_by_national_corporate_taxpayer_identification_number.get(null, {
                            national_individual_taxpayer_identification: identification ?? ''
                        })
                }

                if (!identificationFound?.data?.results?.length) {
                    identificationFound =
                        await PeopleService.natural_person_by_national_individual_taxpayer_identification.get(null, {
                            national_individual_taxpayer_identification: identification ?? ''
                        })
                }
            } else if (identification?.length == 14) {
                identificationFound =
                    await PeopleService.legal_person_by_national_corporate_taxpayer_identification_number.get(null, {
                        national_corporate_taxpayer_identification_number: identification ?? ''
                    })
            }

            if (!identificationFound?.data?.results?.length) {
                return { person: null, user_role: null }
            }

            const uhabUserRole: UhabUserRoleType[] = (
                await CondominiumService.uhab_user_roles_by_person.get({
                    personId: identificationFound.data.results[0].id,
                    fk_lookup_type_of_uhab_user_role: fk_lookup_type_of_uhab_user_role,
                    fk_uhab: fk_uhab
                })
            ).data.results

            if (uhabUserRole?.length) {
                const activeUhabUserRole = uhabUserRole.find(
                    (uhabUserRole: UhabUserRoleType) => uhabUserRole.deactivated_at == null
                )

                return { person: identificationFound.data.results[0], user_role: activeUhabUserRole ?? null }
            }

            return { person: identificationFound.data.results[0], user_role: null }
        }
    )
}
