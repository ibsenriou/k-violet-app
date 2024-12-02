import { useSelector } from 'react-redux'

import { RootState } from 'src/store'

import FallbackSpinner from '@core/components/spinner'

import AboutTheCondominiumViewPage from 'src/views/pages/condominium/about-the-condominium/AboutTheCondominiumMainView'

const AboutTheCondominium = () => {

      const store = useSelector((state: RootState) => state.aboutTheCondominium)

      if (!store.data.condominium) return <FallbackSpinner />

      return <AboutTheCondominiumViewPage />

}

AboutTheCondominium.acl = {
  action: 'read',
  subject: 'about-the-condominium-page'
}

export default AboutTheCondominium
