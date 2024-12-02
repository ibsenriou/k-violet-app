import { SyntheticEvent, useState } from 'react'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

import AccountOutline from 'mdi-material-ui/AccountOutline'
import AccountTieOutline from 'mdi-material-ui/AccountTieOutline'
import UserOccurrencesViewTabInteractions from './tabs/UserOccurrencesViewInteractions'
import UserOccurrencesViewTabDetails from './tabs/UserOccurrencesViewTabDetails'


const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    '& svg': {
        marginBottom: '0 !important',
        marginRight: theme.spacing(3)
    }
}))

const UserOccurrencesViewRight = () => {
  const [value, setValue] = useState<string>('details')

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

              <Tab value='details' label='Detalhes' icon={<AccountTieOutline />} />

              <Tab value='interactions' label='Interações' icon={<AccountOutline />} />

              {/* <Tab value='attachments' label='Anexos' icon={<FactCheckOutlined />} /> */}

          </TabList>
          <Box sx={{ marginTop: 6 }}>
              <TabPanel sx={{ p: 0 }} value='details'>
                  <UserOccurrencesViewTabDetails />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='interactions'>
                  <UserOccurrencesViewTabInteractions />
              </TabPanel>
              {/*
              <TabPanel sx={{ p: 0 }} value='employees'>
                  <UserOccurrencesViewTabAttachments />
              </TabPanel> */}
          </Box>
      </TabContext>
  )
}

export default UserOccurrencesViewRight
