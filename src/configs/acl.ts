import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
    action: Actions
    subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string) => {
    const { can, rules } = new AbilityBuilder(AppAbility)

    can('manage', 'all')
    // if (role === 'Syndicator') {
    // } else if (role === 'Individual Condominium User') {
    //   can(['read'], 'home-page')

    //   can(['read'], 'condominium')

    //   can(['read'], 'about-the-condominium-page')

    //   can(['read'], 'residentials-page')

    //   can(['read'], 'commercials-page')

    //   can(['read'], 'condominium-common-areas-page')
    //   can(['read'], 'condominium-common-areas-page--reservations')

    //   can(['read'], 'reports')

    //   can(['read'], 'acl-page')
    // } else {

    // }

    return rules
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
    return new AppAbility(defineRulesFor(role, subject), {
        // https://casl.js.org/v5/en/guide/subject-type-detection
        // @ts-ignore
        detectSubjectType: object => object!.type
    })
}

export const defaultACLObj: ACLObj = {
    action: 'read',
    subject: 'home-page'
}

export default defineRulesFor
