import { useAppDispatch, useAppSelector } from 'src/store'

import { selectUserAddress, updateAddress } from 'src/store/apps/user'

import AddressForm from 'src/views/common/address-form/AddressForm'

const UserAddressTab = () => {
    const dispatch = useAppDispatch()
    const address = useAppSelector(selectUserAddress)

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
            updateAddress({
                id: address?.id,
                street_name: data.street_name,
                number: data.number,
                complement: data.complement,
                fk_postal_code: data.fk_postal_code,
                fk_state: data.fk_state,
                fk_city: data.fk_city,
                fk_district: data.fk_district
            })
        )
    }

    // TODO - Add ability to check if user can edit address
    return <AddressForm address={address} onChange={onSubmit} canEdit={true}/>
}

export default UserAddressTab
