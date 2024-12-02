import { Ability } from '@casl/ability'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { AbilityContext } from 'src/layouts/components/acl/Can'

import { RootState, useAppDispatch } from 'src/store'

import { patchDataAboutTheCondominiumAddress } from 'src/store/apps/condominium/about-the-condominium'
import AddressForm from 'src/views/common/address-form/AddressForm'

const AboutTheCondominiumAddress = () => {
    const dispatch = useAppDispatch()
    const { condominium, address } = useSelector((state: RootState) => state.aboutTheCondominium.data)

    const onSubmit = async (data: {
        street_name?: string
        number?: string
        complement?: string
        fk_postal_code?: string
        fk_state?: string
        fk_city?: string
        fk_district?: string
    }) => {
        await dispatch(
            patchDataAboutTheCondominiumAddress({
                id: address.id,
                street_name: data.street_name || '',
                number: data.number || '',
                complement: data.complement || '',
                fk_postal_code: data.fk_postal_code || '',
                fk_state: data.fk_state || '',
                fk_city: data.fk_city || '',
                fk_district: data.fk_district || '',
                fk_condominium: condominium.id
            })
        )
    }

    return <AddressForm address={address} onChange={onSubmit} canEdit={true} />
}

export default AboutTheCondominiumAddress
