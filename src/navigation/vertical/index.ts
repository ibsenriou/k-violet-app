// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import ChartBar from 'mdi-material-ui/ChartBar'
import CogOutline from 'mdi-material-ui/CogOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import HomeSearchOutline from 'mdi-material-ui/HomeSearchOutline'
import HomeSwitchOutline from 'mdi-material-ui/HomeSwitchOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import Pool from 'mdi-material-ui/Pool'
import StorePlus from 'mdi-material-ui/StorePlus'
import ViewQuiltOutline from 'mdi-material-ui/ViewQuiltOutline'
import HomePlus from 'mdi-material-ui/HomePlus'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ExpenseIcon from '@mui/icons-material/MonetizationOn'

import TuneIcon from '@mui/icons-material/Tune'
import AccountTree from '@mui/icons-material/AccountTree'
import StoreIcon from '@mui/icons-material/Store'
import BuildIcon from '@mui/icons-material/Build'
import ListIcon from '@mui/icons-material/List'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined'

// ** Type import
import { VerticalNavItemsType } from '@core/layouts/types'
import Tools from 'mdi-material-ui/Tools'
import { CalendarOutline } from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
    return [
        {
            title: 'Home',
            icon: HomeOutline,
            path: '/home'
        },
        {
          title: 'Atvidades',
          icon: CalendarOutline,
          path: '/agenda',
          children: [
            {
              title: 'Atvidades Diárias',
              path: '/agenda/semanal',
            },
            {
              title: 'Atvidades Semanais',
              path: '/agenda/mensal',
            },
            {
              title: 'Atvidades Milestones',
              path: '/agenda/milestones',
            }
          ]
        },
        {
          title: 'Relatório de Atvidades',
          icon: AssignmentIcon,
          path: '/relatorio-atividades',
        },
        {
          title: 'Lojinha',
          icon: StoreIcon,
          path: '/lojinha',
        },
        {
            title: 'Configurações',
            icon: CogOutline,
            path: '/admin',
            children: [
                {
                    title: 'Controle de Acesso',
                    path: '/admin/access-control',

                },
                {
                    title: 'Usuários',
                    path: '/admin/users',
                }
            ]
        },
    ]
}

export default navigation
