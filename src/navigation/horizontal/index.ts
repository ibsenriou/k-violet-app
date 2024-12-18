// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'

// ** Type import
import { HorizontalNavItemsType } from '@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
    {
        title: 'Home',
        icon: HomeOutline,
        path: '/home'
    },
    {
        title: 'Second Page',
        icon: EmailOutline,
        path: '/second-page'
    },
    {
        title: 'Access Control',
        icon: ShieldOutline,
        path: '/acl',
    }
]

export default navigation
