import { SyntheticEvent, useState } from 'react'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

import AccountOutline from 'mdi-material-ui/AccountOutline'
import AccountTieOutline from 'mdi-material-ui/AccountTieOutline'
import CalendarRefreshOutline from 'mdi-material-ui/CalendarRefreshOutline'
import CarOutline from 'mdi-material-ui/CarOutline'
import GarageOpen from 'mdi-material-ui/GarageOpen'
import PeanutOutline from 'mdi-material-ui/PeanutOutline'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'

import ResidentialViewTabResident from 'src/views/pages/condominium/residentials/view/ResidentialViewTabResident'
import ResidentialViewTabEmployees from './ResidentialViewTabEmployees'
import ResidentialViewTabGarages from './ResidentialViewTabGarages'
import ResidentialViewTabPets from './ResidentialViewTabPets'
import ResidentialViewTabProprietaries from './ResidentialViewTabProprietaries'
import ResidentialViewTabVehicles from './ResidentialViewTabVehicles'
import ResidentialViewTabCharges from './ResidentialViewTabCharges'
import { RootState, useAppSelector } from 'src/store'
import { usePermission } from 'src/context/PermissionContext'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    '& svg': {
        marginBottom: '0 !important',
        marginRight: theme.spacing(3)
    }
}))

const ResidentialViewRight = () => {
    const residentialId = useAppSelector((state: RootState) => state.residentialDetail.data.id) as string
    const permissions = usePermission('condominium.residential', { residentialId: residentialId })

    const initialTabValue = permissions.can('proprietary:list') ? 'proprietaries' : 'resident'

    const [value, setValue] = useState<string>(initialTabValue)


    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return (
        <TabContext value={value}>
            <TabList
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='forced scroll tabs example'
                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
                {permissions.can('proprietary:list') && (
                    <Tab value='proprietaries' label='Proprietários' icon={<AccountTieOutline />} />
                )}
                {permissions.can('resident:list') && <Tab value='residents' label='Moradores' icon={<AccountOutline />} />}
                {permissions.can('employee:list') && (
                    <Tab value='employees' label='Funcionários' icon={<CalendarRefreshOutline />} />
                )}
                {permissions.can('garage:list') && <Tab value='garages' label='Garagens' icon={<GarageOpen />} />}
                {permissions.can('vehicle:list') && <Tab value='vehicles' label='Veículos' icon={<CarOutline />} />}
                {permissions.can('pet:list') && <Tab value='pets' label='Pets' icon={<PeanutOutline />} />}
                {permissions.can('charge:list') && <Tab value='charges' label='Faturas' icon={<FactCheckOutlined />} />}
            </TabList>
            <Box sx={{ marginTop: 6 }}>
                <TabPanel sx={{ p: 0 }} value='proprietaries'>
                    <ResidentialViewTabProprietaries />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='residents'>
                    <ResidentialViewTabResident />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='employees'>
                    <ResidentialViewTabEmployees />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='garages'>
                    <ResidentialViewTabGarages />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='vehicles'>
                    <ResidentialViewTabVehicles />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='pets'>
                    <ResidentialViewTabPets />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='charges'>
                    <ResidentialViewTabCharges />
                </TabPanel>
            </Box>
        </TabContext>
    )
}

export default ResidentialViewRight
