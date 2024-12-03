import QRCode from 'qrcode.react'
import { forwardRef, ReactElement, Ref, useState } from 'react'

import Close from 'mdi-material-ui/Close'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import WhatsAppIcon from '@mui/icons-material/WhatsApp'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface SuportDialog {
    open: boolean
    toggle: () => void
}

const SuportDialog = ({ open, toggle }: SuportDialog) => {
    const [whatsappLink, setWhatsappLink] = useState('https://wa.me/5519998411588')

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='md'
            scroll='body'
            onClose={() => toggle()}
            TransitionComponent={Transition}
            onBackdropClick={() => toggle()}
        >
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => toggle()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>

                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Suporte
                    </Typography>
                    <Typography variant='body2'>Entre em contato com o suporte do K-Violet</Typography>
                </Box>

                <Box sx={{ marginLeft: 3 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '10px' }}>
                        Olá! Bem-vindo ao nosso suporte ao cliente.
                    </Typography>

                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '10px' }}>
                        Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de assistência, não hesite em
                        nos contatar através do WhatsApp. Clique no botão abaixo para iniciar uma conversa com um de
                        nossos representantes de suporte.
                    </Typography>

                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '10px' }}>
                        Obrigado por escolher nossos serviços!
                    </Typography>

                    <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton aria-label='whatsApp' onClick={() => window.open(whatsappLink)}>
                            <WhatsAppIcon />
                        </IconButton>
                        WhatsApp
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <QRCode value={whatsappLink} />
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default SuportDialog
