import Box, { BoxProps } from '@mui/material/Box';
import Card, { CardProps }  from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles'

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageProps {
  message: string;
  sender: string;
  timestamp: string | Date;
  isSentByUser?: boolean;
  isSystemMessage?: boolean;
}

const writeSystemMessage = (message: string, sender: string) => {
  const newMessage =
      message === 'Marked as open' ? `Ocorrência criada pelo usuário ${sender}.`
    : message == 'Marked as in progress' ? `Ocorrência foi movida para em andamento pelo usuário ${sender}.`
    : message == 'Marked as resolved' ? `Ocorrência foi marcada como fechada pelo usuário ${sender}.`
    : 'Error: Mensagem de sistema desconhecida.'


  return newMessage

}

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)<BoxProps>(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),

}))

const SystemMessageCard = styled(Card)<CardProps>(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[0],
  textAlign: 'center'
}))

const UserMessageCard = styled(Card)<CardProps>(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
  width: '80%',
  wordBreak: 'break-word'
}))

function SystemMessageCardComponent({ message, sender, timestamp }: MessageProps) {
  return (
    <BoxWrapper>
    <SystemMessageCard>
      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#a7b42f', mb: 1 }}>
        Sistema
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {writeSystemMessage(message, sender)}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
        {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: ptBR })}
      </Typography>
    </SystemMessageCard>
  </BoxWrapper>
  )
}

function UserMessageCardComponent({ message, sender, timestamp, isSentByUser }: MessageProps) {
  return (
    <Box
      display="flex"
      justifyContent={isSentByUser ? 'flex-end' : 'flex-start'}
      sx={{ width: '100%', mb: 2, px: 2 }}
    >
      <UserMessageCard>
        <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {sender}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          {message}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: ptBR })}
        </Typography>
      </UserMessageCard>
    </Box>
  )
}

const Message = ({ message, sender, timestamp, isSentByUser, isSystemMessage: systemMessage }: MessageProps) => {
  if (systemMessage) {
    return <SystemMessageCardComponent message={message} sender={sender} timestamp={timestamp} />
  } else {
    return <UserMessageCardComponent message={message} sender={sender} timestamp={timestamp} isSentByUser={isSentByUser} />
  }

};

export default Message;
