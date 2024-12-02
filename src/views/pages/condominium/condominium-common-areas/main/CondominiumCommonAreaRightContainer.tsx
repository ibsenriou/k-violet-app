// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Redux Store
import { RootState } from 'src/store'

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import CalendarLockOutline from 'mdi-material-ui/CalendarLockOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import ViewListOutline from 'mdi-material-ui/ViewListOutline'

// ** Components Imports
import CondominiumCommonAreaDetailTabInfo from '../detail/tabs/info/CondominiumCommonAreaDetailTabInfo'
import CondominiumCommonAreaDetailTabItems from '../detail/tabs/items/CondominiumCommonAreaDetailTabItems'
import CondominiumCommonAreaDetailTabReservations from '../detail/tabs/reservations/CondominiumCommonAreaDetailTabReservations'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    '& svg': {
        marginBottom: '0 !important',
        marginRight: theme.spacing(3)
    }
}))

const CondominiumCommonAreaRightContainer = () => {
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    const { commonArea } = store

    const [value, setValue] = useState<string>('info')
    const [tab, setab] = useState<string>('config')

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    const handleChangeTabToReservas = () => {
        setValue('reservas')
        setab('reservation_periods')
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
                <Tab value='info' label='Info' icon={<InformationOutline />} />
                <Tab value='itensDeAreaComum' label='Itens' icon={<ViewListOutline />} />
                {commonArea.does_it_requires_reservation && (
                    <Tab value='reservas' label='Reservas' icon={<CalendarLockOutline />} />
                )}
            </TabList>
            <Box sx={{ marginTop: 6 }}>
                <TabPanel sx={{ p: 0 }} value='info'>
                    <CondominiumCommonAreaDetailTabInfo changeTabToReservas={handleChangeTabToReservas} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='itensDeAreaComum'>
                    <CondominiumCommonAreaDetailTabItems />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='reservas'>
                    <CondominiumCommonAreaDetailTabReservations tab={tab} />
                </TabPanel>
            </Box>
        </TabContext>
    )
}

export default CondominiumCommonAreaRightContainer
