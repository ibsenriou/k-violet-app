// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Custom Components Imports
import TabReservasViewTabConfig from './reservations-subtabs/reservation-1-Config/ReservationsSubTabConfig'
import ReservationsSubTabReservationsPeriod from './reservations-subtabs/reservation-2-Periods/ReservationsSubTabReservationPeriods'
import ReservationsSubTabReservationFees from './reservations-subtabs/reservation-3-Fees/ReservationsSubTabReservationFees'
import ReservationsSubTabReservationHistory from './reservations-subtabs/reservation-4-History/ReservationsSubTabReservationHistory'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    '& svg': {
        marginBottom: '0 !important',
        marginRight: theme.spacing(3)
    }
}))

type CommonAreaDetailTabReservationsProps = {
    tab: string
}

const CondominiumCommonAreaDetailTabReservations = ({ tab }: CommonAreaDetailTabReservationsProps) => {
    const [value, setValue] = useState<string>(tab)

    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)
    const commonArea = store.commonArea

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
                sx={{
                    backgroundColor: theme => (theme.palette.mode === 'light' ? 'grey.50' : 'background.paper'),
                    borderRadius: '8px',
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Tab value='config' label='Config' />
                <Tab value='reservation_periods' label='Períodos de Reserva' />
                {commonArea?.does_it_have_usage_fee && <Tab value='reservation_fees' label='Taxas' />}
                <Tab value='reservation_history' label='Hist. Reservas' />
            </TabList>
            <Box sx={{ marginTop: 6 }}>
                <TabPanel sx={{ p: 0 }} value='config'>
                    <TabReservasViewTabConfig />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='reservation_periods'>
                    <ReservationsSubTabReservationsPeriod />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='reservation_fees'>
                    <ReservationsSubTabReservationFees />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='reservation_history'>
                    <ReservationsSubTabReservationHistory />
                </TabPanel>
            </Box>
        </TabContext>
    )
}

export default CondominiumCommonAreaDetailTabReservations
