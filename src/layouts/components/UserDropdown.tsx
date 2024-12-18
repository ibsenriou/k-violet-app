import { Fragment, SyntheticEvent, useState } from 'react'

import { useRouter } from 'next/router'

import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// import AccountOutline from 'mdi-material-ui/AccountOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'

import { useAuth } from 'src/hooks/useAuth'

import { Settings } from '@core/context/settingsContext'
import { useAppSelector } from 'src/store'
import { selectUser } from 'src/store/apps/user'
import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import { useQuery } from '@tanstack/react-query'
import { AuthService } from 'src/services/authService'

interface Props {
    settings: Settings
}

// const BadgeContentSpan = styled('span')(({ theme }) => ({
//     width: 8,
//     height: 8,
//     borderRadius: '50%',
//     backgroundColor: theme.palette.success.main,
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
// }))

const UserDropdown = (props: Props) => {
    const user = useAppSelector(selectUser)

    const { settings } = props

    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const router = useRouter()

    const { logout } = useAuth()

    const { direction } = settings

    const handleDropdownOpen = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDropdownClose = (url?: string) => {
        if (url) {
            router.push(url)
        }
        setAnchorEl(null)
    }

    // const styles = {
    //     py: 2,
    //     px: 4,
    //     width: '100%',
    //     display: 'flex',
    //     alignItems: 'center',
    //     color: 'text.primary',
    //     textDecoration: 'none',
    //     '& svg': {
    //         fontSize: '1.375rem',
    //         color: 'text.secondary'
    //     }
    // }

    const userFullName = user?.first_name + ' ' + user?.last_name

    const handleLogout = () => {
        logout()
        handleDropdownClose()
    }

    const userCoinsQuery = useQuery({
      queryKey: ['userCoins'],
      queryFn: () => AuthService.user.get().then(response => response.data)
    })

    const userCoins = userCoinsQuery.data?.coins || 0
    const userAmassedCoins = userCoinsQuery.data?.amassed_coins || 0

    return (
        <Fragment>
            <Badge
                overlap='circular'
                onClick={handleDropdownOpen}
                sx={{ ml: 2, cursor: 'pointer' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
              <Avatar alt='John Doe' src='/images/avatars/6.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleDropdownClose()}
                sx={{ '& .MuiMenu-paper': { minWidth: 250, width: 'auto', marginTop: 4 } }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: direction === 'ltr' ? 'right' : 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: direction === 'ltr' ? 'right' : 'left'
                }}
            >
                <Box sx={{ pt: 2, pb: 3, px: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                            overlap='circular'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                        >
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'success'}
                                sx={{ fontWeight: 600, borderRadius: '50%', width: 50, height: 50 }}
                            >
                                {getInitials(user?.first_name)}
                            </CustomAvatar>
                        </Badge>
                        <Box
                            sx={{
                                display: 'flex',
                                marginLeft: 3,
                                alignItems: 'flex-start',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography sx={{ fontWeight: 600 }}>{userFullName}</Typography>
                            <Typography variant='body2' sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                                {user?.email}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                                {userCoins} moedinhas 💰
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                                {userAmassedCoins} medinhas acumuladas 💰💰💰
                            </Typography>

                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ mt: 0, mb: 1 }} />

                <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
                    <LogoutVariant
                        sx={{
                            marginRight: 2,
                            fontSize: '1.375rem',
                            color: 'text.secondary'
                        }}
                    />
                    Sair
                </MenuItem>
            </Menu>
        </Fragment>
    )
}

export default UserDropdown
