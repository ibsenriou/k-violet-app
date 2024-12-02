import { useSelector } from 'react-redux'

import { RootState } from 'src/store'

import FallbackSpinner from '@core/components/spinner'

import UserDataMainView from 'src/views/pages/settings/user-data/UserDataMainView'

const AboutTheCondominium = () => {
    const store = useSelector((state: RootState) => state.aboutTheCondominium)

    if (!store.data.condominium) return <FallbackSpinner />

    return <UserDataMainView />
}

export default AboutTheCondominium
