// ** React Imports
import { ElementType, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { Settings } from '@core/context/settingsContext'
import { NavGroup, NavLink } from '@core/layouts/types'

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations'
import UserIcon from 'src/layouts/components/UserIcon'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils
import { handleURLQueries } from '@core/layouts/utils'
import { usePermission } from 'src/context/PermissionContext'

interface Props {
    parent?: boolean
    item: NavLink
    navHover?: boolean
    settings: Settings
    navVisible?: boolean
    collapsedNavWidth: number
    navigationBorderWidth: number
    toggleNavVisibility: () => void
    isSubToSub?: NavGroup | undefined
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
    ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
    width: '100%',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    color: theme.palette.text.primary,
    padding: theme.spacing(2.25, 3.5),
    transition: 'opacity .25s ease-in-out',
    '&.active, &.active:hover': {
        boxShadow: theme.shadows[3],
        backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
    },
    '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
        color:
            theme.palette.mode === 'light'
                ? `${theme.palette.common.white} !important`
                : `${theme.palette.common.black} !important` //TODO LARI CORES - Cor da letra do menu lateral
    }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'opacity .25s ease-in-out',
    ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({
    item,
    parent,
    navHover,
    settings,
    navVisible,
    isSubToSub,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth
}: Props) => {
    // ** Hooks
    const theme = useTheme()
    const router = useRouter()

    // ** Vars
    const { skin, navCollapsed } = settings

    const IconTag: ReactNode = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

    const conditionalBgColor = () => {
        if (skin === 'semi-dark' && theme.palette.mode === 'light') {
            return {
                color: `rgba(${theme.palette.customColors.dark}, 0.87)`,
                '&:hover': {
                    backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.04)`
                }
            }
        } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
            return {
                color: `rgba(${theme.palette.customColors.light}, 0.87)`,
                '&:hover': {
                    backgroundColor: `rgba(${theme.palette.customColors.light}, 0.04)`
                }
            }
        } else return {}
    }

    const isNavLinkActive = () => {
        if (router.pathname === item.path || handleURLQueries(router, item.path)) {
            return true
        } else {
            return false
        }
    }

    const { canModule } = usePermission()

    if (item.permission && !canModule(item.permission)) {
        return null
    }

    return (
        <ListItem
            disablePadding
            className='nav-link'
            disabled={item.disabled || false}
            sx={{ mt: 1.5, px: '0 !important' }}
        >
            <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
                <MenuNavLink
                    component={'a'}
                    className={isNavLinkActive() ? 'active' : ''}
                    {...(item.openInNewTab ? { target: '_blank' } : null)}
                    onClick={e => {
                        if (item.path === undefined) {
                            e.preventDefault()
                            e.stopPropagation()
                        }
                        if (navVisible) {
                            toggleNavVisibility()
                        }
                    }}
                    sx={{
                        ...conditionalBgColor(),
                        ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
                        pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 5.5
                    }}
                >
                    {isSubToSub ? null : (
                        <ListItemIcon
                            sx={{
                                color: 'text.primary',
                                transition: 'margin .25s ease-in-out',
                                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
                                ...(parent ? { ml: 1.25, mr: 3.75 } : {}) // This line should be after (navCollapsed && !navHover) condition for proper styling
                            }}
                        >
                            <UserIcon
                                icon={IconTag}
                                componentType='vertical-menu'
                                iconProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        ...(!parent ? { fontSize: '1.5rem' } : {}),
                                        ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                                    }
                                }}
                            />
                        </ListItemIcon>
                    )}

                    <MenuItemTextMetaWrapper
                        sx={{
                            ...(isSubToSub ? { marginLeft: 9 } : {}),
                            ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
                        }}
                    >
                        <Typography
                            {...((themeConfig.menuTextTruncate ||
                                (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                                noWrap: true
                            })}
                        >
                            <Translations text={item.title} />
                        </Typography>
                        {item.badgeContent ? (
                            <Chip
                                label={item.badgeContent}
                                color={item.badgeColor || 'primary'}
                                sx={{
                                    height: 20,
                                    fontWeight: 500,
                                    marginLeft: 1.25,
                                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                                }}
                            />
                        ) : null}
                    </MenuItemTextMetaWrapper>
                </MenuNavLink>
            </Link>
        </ListItem>
    )
}

export default VerticalNavLink
