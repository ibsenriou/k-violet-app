import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'
import { LookupsService } from 'src/services/lookupsService'
import useService from './useService'

function useContactInformation(
    personContactInformationSet: PersonContactInformationType[],
    type: string,
    dependencies?: Array<any>
) {
    const { find: findContact } = useService(LookupsService.lookup_type_of_contact_information, null, dependencies)
    if (!personContactInformationSet || !Array.isArray(personContactInformationSet)) return ''

    const data = personContactInformationSet.find(
        item => findContact(item.fk_lookup_type_of_contact_information)?.description === type
    )

    return { id: data?.id, description: data?.description }
}

export default useContactInformation
