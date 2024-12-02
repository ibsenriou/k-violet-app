// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Backdrop from '@mui/material/Backdrop'
import Box, { BoxProps } from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from '@core/layouts/types'

// ** Components
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'
import Footer from './components/shared-components/footer'
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'

// ** Styled Component
import DatePickerWrapper from '@core/styles/libs/react-datepicker'

const VerticalLayoutWrapper = styled('div')({
    height: '100%',
    display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(6),
    transition: 'padding .25s ease-in-out',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    }
}))

const VerticalLayout = (props: LayoutProps) => {
    // ** Props
    const { hidden, settings, children, scrollToTop } = props

    // ** Vars
    const { skin, contentWidth } = settings
    const navWidth = themeConfig.navigationSize
    const navigationBorderWidth = skin === 'bordered' ? 1 : 0
    const collapsedNavWidth = themeConfig.collapsedNavigationSize

    // ** States
    const [navHover, setNavHover] = useState<boolean>(false)
    const [navVisible, setNavVisible] = useState<boolean>(false)
    const [showBackdrop, setShowBackdrop] = useState<boolean>(false)

    // ** Toggle Functions
    const toggleNavVisibility = () => setNavVisible(!navVisible)

    return (
        <>
            <VerticalLayoutWrapper className='layout-wrapper'>
                {/* Navigation Menu */}
                {settings.navHidden ? null : (
                    <Navigation
                        navWidth={navWidth}
                        navHover={navHover}
                        navVisible={navVisible}
                        setNavHover={setNavHover}
                        setNavVisible={setNavVisible}
                        collapsedNavWidth={collapsedNavWidth}
                        toggleNavVisibility={toggleNavVisibility}
                        navigationBorderWidth={navigationBorderWidth}
                        {...props}
                    />
                )}
                <MainContentWrapper className='layout-content-wrapper'>
                    {/* AppBar Component */}
                    <AppBar setShowBackdrop={setShowBackdrop} toggleNavVisibility={toggleNavVisibility} {...props} />

                    {/* Content */}
                    <ContentWrapper
                        className='layout-page-content'
                        sx={{
                            ...(contentWidth === 'boxed' && {
                                mx: 'auto'
                            })
                        }}
                    >
                        {children}
                    </ContentWrapper>

                    {/* Footer Component */}
                    <Footer showBackdrop={showBackdrop} {...props} />

                    {/* Portal for React Datepicker */}
                    <DatePickerWrapper sx={{ zIndex: 11 }}>
                        <Box id='react-datepicker-portal'></Box>
                    </DatePickerWrapper>
                </MainContentWrapper>

                {/* Backdrop */}
                <Backdrop open={showBackdrop} onClick={() => setShowBackdrop(false)} sx={{ zIndex: 12 }} />
            </VerticalLayoutWrapper>

            {/* Customizer */}
            {themeConfig.disableCustomizer || hidden ? null : <Customizer />}

            {/* Scroll to top button */}
            {scrollToTop ? (
                scrollToTop(props)
            ) : (
                <ScrollToTop className='mui-fixed'>
                    <Fab color='primary' size='small' aria-label='scroll back to top'>
                        <ArrowUp />
                    </Fab>
                </ScrollToTop>
            )}
        </>
    )
}

export default VerticalLayout
