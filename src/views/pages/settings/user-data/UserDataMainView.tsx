import { SyntheticEvent, useState } from 'react'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

import BellOutline from 'mdi-material-ui/BellOutline'
import BookmarkOutline from 'mdi-material-ui/BookmarkOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'


import UserSecurityTab from './tabs/UserSecurityTab'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: 67
    }
}))

const TabName = styled('span')(({ theme }) => ({
    lineHeight: 1.71,
    fontSize: '0.875rem',
    marginLeft: theme.spacing(2.4),
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))

const UserDataMainView = () => {
    const [value, setValue] = useState('info')

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        event.preventDefault()
        setValue(newValue)
    }

    return (
        <Card>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label='account-settings tabs'
                    sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                    <Tab
                        value='info'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InformationOutline />
                                <TabName>Info</TabName>
                            </Box>
                        }
                    />
                    <Tab
                        value='address'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BookmarkOutline />
                                <TabName>Endereço</TabName>
                            </Box>
                        }
                    />
                    <Tab
                        value='contact'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BellOutline />
                                <TabName>Contatos</TabName>
                            </Box>
                        }
                    />
                    <Tab
                        value='security'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BellOutline />
                                <TabName>Segurança</TabName>
                            </Box>
                        }
                    />
                </TabList>

                {/* <TabPanel sx={{ p: 0 }} value='info'>
                    <UserInformationsTab key={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='address'>
                    <UserAddressTab key={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='contact'>
                    <UserContactsTab key={value} />
                </TabPanel> */}
                <TabPanel sx={{ p: 0 }} value='security'>
                    <UserSecurityTab key={value} />
                </TabPanel>
            </TabContext>
        </Card>
    )
}

export default UserDataMainView
