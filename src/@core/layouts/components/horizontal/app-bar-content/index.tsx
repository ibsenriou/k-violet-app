// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Type Import
import { Settings } from '@core/context/settingsContext'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

interface Props {
    hidden: boolean
    settings: Settings
    setShowBackdrop: (val: boolean) => void
    saveSettings: (values: Settings) => void
    horizontalAppBarContent?: (props?: any) => ReactNode
    horizontalAppBarBranding?: (props?: any) => ReactNode
}

const StyledLink = styled('a')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginRight: theme.spacing(8)
}))

const AppBarContent = (props: Props) => {
    // ** Props
    const {
        horizontalAppBarContent: userHorizontalAppBarContent,
        horizontalAppBarBranding: userHorizontalAppBarBranding
    } = props

    // ** Hooks
    const theme = useTheme()

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {userHorizontalAppBarBranding ? (
                userHorizontalAppBarBranding(props)
            ) : (
                <Link href='/' passHref>
                    <StyledLink>
                        <img width={30} src={`/images/logos/Logo-${theme.palette.mode}.png`} />
                        <Typography
                            variant='h6'
                            sx={{
                                ml: 3,
                                fontWeight: 600,
                                lineHeight: 'normal',
                                textTransform: 'uppercase'
                            }}
                        >
                            {themeConfig.templateName}
                        </Typography>
                    </StyledLink>
                </Link>
            )}
            {userHorizontalAppBarContent ? userHorizontalAppBarContent(props) : null}
        </Box>
    )
}

export default AppBarContent
