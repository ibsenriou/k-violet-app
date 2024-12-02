// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const StyledLink = styled('a')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginRight: theme.spacing(8)
}))

const BlankLayoutAppBar = () => {
    // ** Hooks
    const theme = useTheme()

    return (
        <AppBar elevation={3} color='default' position='sticky'>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    padding: theme => `${theme.spacing(0, 6)} !important`,
                    minHeight: `${theme.mixins.toolbar.minHeight}px !important`
                }}
            >
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
            </Toolbar>
        </AppBar>
    )
}

export default BlankLayoutAppBar
