import SuportDialog from '@core/components/suport'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'

const FooterContent = () => {
    const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const togglePetDialog = () => setToggleDialog(!toggleDialog)
    const [toggleDialog, setToggleDialog] = useState(false)

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ mr: 2 }}>{`© ${new Date().getFullYear()} K-Violet`}</Typography>
            {hidden ? null : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
                    <Link onClick={togglePetDialog} sx={{ cursor: 'pointer' }}>
                        Suporte
                    </Link>
                    <SuportDialog open={toggleDialog} toggle={togglePetDialog} />
                </Box>
            )}
        </Box>
    )
}

export default FooterContent
