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
            title: 'Condomínio',
            icon: KeyOutline,
            badgeColor: 'success',
            children: [
                {
                    title: 'Sobre o Condomínio',
                    icon: HomeSearchOutline,
                    path: '/condominium/about-the-condominium',
                    permission: 'condominium.about_the_condominium'
                },
                {
                    title: 'Residenciais',
                    icon: HomeSwitchOutline,
                    path: '/condominium/residentials',
                    permission: 'condominium.residential'
                },
                {
                    title: 'Comerciais',
                    icon: StorePlus,
                    path: '/condominium/commercials',
                    permission: 'condominium.commercial'
                },
                {
                    title: 'Ativos de Condomínio',
                    icon: ListIcon,
                    path: '/condominium/asset',
                    permission: 'condominium.asset'
                },
                {
                    title: 'Áreas Comuns',
                    icon: Pool,
                    path: '/condominium/condominium-common-areas',
                    permission: 'condominium.common_area'
                },
                {
                    title: 'Comunicados',
                    icon: EmailOutline,
                    path: '/condominium/notifications',
                    permission: 'condominium.notification'
                },
                {
                    title: 'Ocorrências',
                    icon: AssignmentIcon,
                    path: '/condominium/user-occurrences',
                    permission: 'condominium.user_occurrence',
                }
            ]
        },
        {
            title: 'Financeiro',
            icon: Tools,
            path: '/financial',
            children: [
                {
                    title: 'Arrecadações',
                    icon: AssignmentIcon,
                    path: '/financial/collections',
                    permission: 'financial.collection'
                },
                {
                    title: 'Contas Bancárias',
                    icon: AccountBalanceIcon,
                    path: '/financial/bank-accounts',
                    permission: 'financial.bank-accounts'
                },
                {
                    title: 'Cobranças',
                    icon: AssignmentIcon,
                    path: '/financial/charges',
                    permission: 'financial.charges'
                },
                {
                    title: 'Despesas',
                    icon: ExpenseIcon,
                    path: '/financial/expenses',
                    permission: 'financial.expenses'
                }
            ]
        },
        {
            title: 'Parametrização',
            icon: TuneIcon,
            path: '/parameters',
            children: [
                {
                    title: 'Itens de Leitura',
                    icon: AssignmentIcon,
                    path: '/parameters/reading-item',
                    permission: 'parameters.reading_item'
                },
                {
                    title: 'Fração Ideal',
                    icon: ViewQuiltOutline,
                    path: '/parameters/ideal-fraction',
                    permission: 'parameters.ideal_fraction'
                },
                {
                    title: 'Plano de Contas',
                    icon: AccountTree,
                    path: '/parameters/accounting-plan',
                    permission: 'parameters.accounting_plan'
                },
                {
                    title: 'Fornecedores',
                    icon: StoreIcon,
                    path: '/parameters/supplier',
                    permission: 'parameters.supplier'
                },
                {
                    title: 'Produtos',
                    icon: LocalGroceryStoreIcon,
                    path: '/parameters/product',
                    permission: 'parameters.product'
                },
                {
                    title: 'Serviços',
                    icon: BuildIcon,
                    path: '/parameters/service',
                    permission: 'parameters.service'
                }
            ]
        },
        {
            title: 'Relatórios',
            icon: ChartBar,
            path: '/reports',
            children: [
                {
                    title: 'Proprietários',
                    path: '/reports/proprietary',
                    permission: 'reports.proprietary'
                },
                {
                    title: 'Moradores',
                    path: '/reports/resident',
                    permission: 'reports.resident'
                },
                {
                    title: 'Locatários',
                    path: '/reports/renter',
                    permission: 'reports.renter'
                },
                {
                    title: 'Funcionários',
                    path: '/reports/employee',
                    permission: 'reports.employee'
                },
                {
                    title: 'Garagens',
                    path: '/reports/garage',
                    permission: 'reports.garage'
                },
                {
                    title: 'Veículos',
                    path: '/reports/vehicle',
                    permission: 'reports.vehicle'
                },
                {
                    title: 'Pets',
                    path: '/reports/pets',
                    permission: 'reports.pets'
                }
            ]
        },
        {
            title: 'Homespace Pay',
            icon: HomePlus,
            path: '/homespace-pay',
            children: [
                {
                    title: 'Conta',
                    path: '/homespace-pay/account',
                    permission: 'homespace-pay.account'
                }
            ]
        },

        {
            title: 'Administração',
            icon: CogOutline,
            path: '/admin',
            children: [
                {
                    title: 'Controle de Acesso',
                    path: '/admin/access-control',
                    permission: 'access_control.role_permission'
                },
                {
                    title: 'Usuários',
                    path: '/admin/users',
                    permission: 'access_control.user_role'
                }
            ]
        },
        {
            title: 'Agenda',
            icon: CalendarOutline,
            path: '/agenda',

            // permission: 'agenda' // TODO - Confirm and enable permission
        }
    ]
}

export default navigation
