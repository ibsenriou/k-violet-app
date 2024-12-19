// ** Icon imports
import AssignmentIcon from '@mui/icons-material/Assignment'
import CogOutline from 'mdi-material-ui/CogOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

import StoreIcon from '@mui/icons-material/Store'

// ** Type import
import { VerticalNavItemsType } from '@core/layouts/types'

import { AccountChildOutline, IceCream } from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
    return [
        {
            title: 'Home',
            icon: HomeOutline,
            path: '/home'
        },
        {
          title: 'Missões Diárias',
          icon: IceCream,
          path: '/missions',
        },
        {
          title: 'Lojinha',
          icon: StoreIcon,
          path: '/little-store',
        },
        {
          title: 'Conquistas',
          icon: AccountChildOutline,
          path: '/achievements',
        }

        // {
        //     title: 'Configurações',
        //     icon: CogOutline,
        //     path: '/admin',
        //     children: [
        //         {
        //             title: 'Controle de Acesso',
        //             path: '/admin/access-control',

        //         },
        //         {
        //             title: 'Usuários',
        //             path: '/admin/users',
        //         }
        //     ]
        // },
    ]
}

export default navigation
