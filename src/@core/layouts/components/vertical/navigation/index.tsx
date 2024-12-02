// ** React Import
import { ReactNode, useRef, useState } from 'react'

// ** MUI Import
import List from '@mui/material/List'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type Import
import { Settings } from '@core/context/settingsContext'
import { VerticalNavItemsType } from '@core/layouts/types'

// ** Component Imports
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'

// ** Util Import
import { hexToRGBA } from '@core/utils/hex-to-rgba'

interface Props {
    hidden: boolean
    navWidth: number
    navHover: boolean
    settings: Settings
    children: ReactNode
    navVisible: boolean
    collapsedNavWidth: number
    navigationBorderWidth: number
    toggleNavVisibility: () => void
    setNavHover: (values: boolean) => void
    setNavVisible: (value: boolean) => void
    verticalNavItems?: VerticalNavItemsType
    saveSettings: (values: Settings) => void
    verticalNavMenuContent?: (props?: any) => ReactNode
    afterVerticalNavMenuContent?: (props?: any) => ReactNode
    beforeVerticalNavMenuContent?: (props?: any) => ReactNode
}

const StyledBoxForShadow = styled(Box)<BoxProps>({
    top: 50,
    left: -8,
    zIndex: 2,
    height: 75,
    display: 'none',
    position: 'absolute',
    pointerEvents: 'none',
    width: 'calc(100% + 15px)',
    '&.d-block': {
        display: 'block'
    }
})

const Navigation = (props: Props) => {
    // ** Props
    const {
        hidden,
        navHover,
        settings,
        afterVerticalNavMenuContent,
        beforeVerticalNavMenuContent,
        verticalNavMenuContent: userVerticalNavMenuContent
    } = props

    // ** States
    const [groupActive, setGroupActive] = useState<string[]>([])
    const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])

    // ** Ref
    const shadowRef = useRef(null)

    // ** Hooks
    const theme = useTheme()

    // ** Var
    const { skin, navCollapsed } = settings

    // ** Fixes Navigation InfiniteScroll
    const handleInfiniteScroll = (ref: HTMLElement) => {
        if (ref) {
            // @ts-ignore
            ref._getBoundingClientRect = ref.getBoundingClientRect

            ref.getBoundingClientRect = () => {
                // @ts-ignore
                const original = ref._getBoundingClientRect()

                return { ...original, height: Math.floor(original.height) }
            }
        }
    }

    // ** Scroll Menu
    const scrollMenu = (container: any) => {
        container = hidden ? container.target : container
        if (shadowRef && container.scrollTop > 0) {
            // @ts-ignore
            if (!shadowRef.current.classList.contains('d-block')) {
                // @ts-ignore
                shadowRef.current.classList.add('d-block')
            }
        } else {
            // @ts-ignore
            shadowRef.current.classList.remove('d-block')
        }
    }

    const shadowBgColor = () => {
        if (skin === 'semi-dark' && theme.palette.mode === 'light') {
            return `linear-gradient(${theme.palette.customColors.darkBg} 40%,${hexToRGBA(
                theme.palette.customColors.darkBg,
                0.1
            )} 95%,${hexToRGBA(theme.palette.customColors.darkBg, 0.05)})`
        } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
            return `linear-gradient(${theme.palette.customColors.lightBg} 40%,${hexToRGBA(
                theme.palette.customColors.lightBg,
                0.1
            )} 95%,${hexToRGBA(theme.palette.customColors.lightBg, 0.05)})`
        } else {
            return `linear-gradient(${theme.palette.background.default} 40%,${hexToRGBA(
                theme.palette.background.default,
                0.1
            )} 95%,${hexToRGBA(theme.palette.background.default, 0.05)})`
        }
    }

    const ScrollWrapper = hidden ? Box : PerfectScrollbar

    return (
        <Drawer {...props}>
            <VerticalNavHeader {...props} />
            <StyledBoxForShadow ref={shadowRef} sx={{ background: shadowBgColor() }} />
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                {/* @ts-ignore */}
                <ScrollWrapper
                    containerRef={(ref: any) => handleInfiniteScroll(ref)}
                    {...(hidden
                        ? {
                              onScroll: (container: any) => scrollMenu(container),
                              sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
                          }
                        : {
                              options: { wheelPropagation: false },
                              onScrollY: (container: any) => scrollMenu(container)
                          })}
                >
                    {beforeVerticalNavMenuContent ? beforeVerticalNavMenuContent(props) : null}
                    {userVerticalNavMenuContent ? (
                        userVerticalNavMenuContent(props)
                    ) : (
                        <List
                            className='nav-items'
                            sx={{
                                transition: 'padding .25s ease',
                                pr: !navCollapsed || (navCollapsed && navHover) ? 4.5 : 1.25
                            }}
                        >
                            <VerticalNavItems
                                groupActive={groupActive}
                                setGroupActive={setGroupActive}
                                currentActiveGroup={currentActiveGroup}
                                setCurrentActiveGroup={setCurrentActiveGroup}
                                {...props}
                            />
                        </List>
                    )}
                    {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}
                </ScrollWrapper>
            </Box>
        </Drawer>
    )
}

export default Navigation
