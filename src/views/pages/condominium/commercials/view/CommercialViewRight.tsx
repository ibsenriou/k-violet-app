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
import GarageOpen from 'mdi-material-ui/GarageOpen'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'

import CommercialViewTabRenter from 'src/views/pages/condominium/commercials/view/CommercialViewTabRenter'
import CommercialViewTabEmployees from './CommercialViewTabEmployees'
import CommercialViewTabGarages from './CommercialViewTabGarages'
import CommercialViewTabProprietaries from './CommercialViewTabProprietaries'
import CommercialViewTabCharges from './CommercialViewTabCharges'
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

const CommercialViewRight = () => {
  const commercialId = useAppSelector((state: RootState) => state.commercialDetail.data.id) as string
  const permissions = usePermission('condominium.commercial', { commercialId: commercialId })

  const initialTabValue = permissions.can('proprietaries:list') ? 'proprietaries' : 'renters'

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
              {permissions.can('renter:list') && (
                  <Tab value='renters' label='Locatário Comercial' icon={<AccountOutline />} />
              )}
              {permissions.can('employee:list') && (
                  <Tab value='employees' label='Funcionários' icon={<CalendarRefreshOutline />} />
              )}
              {permissions.can('garage:list') && (
                  <Tab value='garages' label='Garagens' icon={<GarageOpen />} />
              )}
              {permissions.can('charge:list') && (
                  <Tab value='charges' label='Faturas' icon={<FactCheckOutlined />} />
              )}
          </TabList>
          <Box sx={{ marginTop: 6 }}>
              <TabPanel sx={{ p: 0 }} value='proprietaries'>
                  <CommercialViewTabProprietaries />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='renters'>
                  <CommercialViewTabRenter />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='employees'>
                  <CommercialViewTabEmployees />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='garages'>
                  <CommercialViewTabGarages />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='charges'>
                  <CommercialViewTabCharges />
              </TabPanel>
          </Box>
      </TabContext>
  )
}

export default CommercialViewRight
