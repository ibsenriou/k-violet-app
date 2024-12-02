import ConfirmationDialog from '@core/components/confirmation-dialog';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CondominiumService } from 'src/services/condominiumService';


import Message from './Message';
import { UserOccurrenceStatus } from '../../enums';
import { usePermission } from 'src/context/PermissionContext';
import { useAuth } from 'src/hooks/useAuth';


const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const { occurrenceId } = router.query as { occurrenceId: string };

  const queryClient = useQueryClient();
  const permissions = usePermission();
  const authContext = useAuth();
  const currentUserId = authContext.user?.id;

  // Fetching occurrence data
  const { data: userOccurrence } = useQuery({
    queryKey: ['userOccurrence', occurrenceId],
    queryFn: () => {
        return CondominiumService.condominium_user_occurrenceId.get({ userOccurrenceId: occurrenceId })
    },
    select: response => response.data
  })

  // Fetching messages
  const messages = userOccurrence?.statuses || [];


  // ** Mutations
  const addMessageMutation = useMutation({
    mutationFn: (message: string) => {
      return CondominiumService.condominium_user_occurrenceId_comment.post({ userOccurrenceId: occurrenceId }, { comment: message })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOccurrence', occurrenceId] })
    }
  })


  const markAsInProgressMutation = useMutation({
    mutationFn: () => {
      return CondominiumService.condominium_user_occurrenceId_mark_as_in_progress.post({ userOccurrenceId: occurrenceId }, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOccurrence', occurrenceId] })
    }
  })

  const markAsResolvedMutation = useMutation({
    mutationFn: () => {
      return CondominiumService.condominium_user_occurrenceId_mark_as_resolved.post({ userOccurrenceId: occurrenceId }, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOccurrence', occurrenceId] })
    }
  })

  // ** Handlers
  const handleSendNewMessage = (message: string) => {
    addMessageMutation.mutate(message);
  }


  const handleMarkAsInProgress = () => {
    markAsInProgressMutation.mutate()
  }

  const handleMarkAsResolved = () => {
    markAsResolvedMutation.mutate()
  }

  // Permission checks
  const canChangeStatus = permissions.can('condominium.user_occurrence.status:create');
  let [canSendMessage, sendMessagePermissionAttributes] = permissions.canWithAttributes('condominium.user_occurrence.send_message:create');
  if (sendMessagePermissionAttributes.some(a => a.some(b => b == "CREATED_BY"))) {
    canSendMessage = userOccurrence?.created_by == currentUserId;
  }

  const isInProgress = userOccurrence?.current_status === UserOccurrenceStatus.inProgress;
  const isOpen = userOccurrence?.current_status === UserOccurrenceStatus.open;
  const isResolved = userOccurrence?.current_status === UserOccurrenceStatus.resolved;
  const displayPublicDisclaimer = userOccurrence?.privacy === 'public' && !isResolved;

  if (!userOccurrence) return null; // Early return if occurrence data is not available

  const PublicDisclaimer = () => (
    <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64, borderRadius: '5px', color: '#fff', padding: '0 16px', marginBottom: 2 }}>
      <Typography variant="body2">
        Esta ocorrência é pública. Todos os condôminos podem visualizar as mensagens. Siga todas as regras e regulamentos do condomínio.
      </Typography>
    </Card>
  );

  const ResolvedMessage = () => (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 64 }}>
      <Typography variant="body2">Atendimento encerrado. Não é possível enviar mensagens.</Typography>
    </Box>
  );

  const CommentRestrictionMessage = () => (
    <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64, borderRadius: '5px', color: '#fff', padding: '0 16px', marginBottom: 2 }}>
      <Typography variant="body2">Você não pode enviar mensagens nesta ocorrência.</Typography>
    </Card>
  );

  const ChangeStatusActions = () => (
    <>
      {isInProgress && (
        <ConfirmationDialog
          title="Encerrar Atendimento"
          subTitle="Marcar ocorrência como resolvida."
          content="Esta ação irá encerrar a ocorrência. Deseja realmente encerrá-la?"
          onConfirm={handleMarkAsResolved}
          render={(confirm) => (
            <Tooltip title="Encerrar Atendimento">
              <IconButton onClick={() => confirm({})}>
                <ModelTrainingOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          confirmLabel="Encerrar Atendimento"
        />
      )}

      {isOpen && (
        <ConfirmationDialog
          title="Iniciar Atendimento"
          subTitle="Marcar ocorrência como em andamento."
          content="Esta ação irá iniciar o atendimento da ocorrência. Deseja realmente iniciar?"
          onConfirm={handleMarkAsInProgress}
          render={(confirm) => (
            <Tooltip title="Iniciar Atendimento">
              <IconButton onClick={() => confirm({})}>
                <ModelTrainingOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          confirmLabel="Iniciar Atendimento"
        />
      )}
    </>
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Public disclaimer */}
      {displayPublicDisclaimer && <PublicDisclaimer />}

      {/* Message list */}
      <Box sx={{ maxHeight: '50vh', overflowY: 'auto', flexGrow: 1, mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message.description}
              sender={message.created_by_name}
              timestamp={message.created_at}
              isSentByUser={message.created_by === currentUserId}
              isSystemMessage={message.is_system_generated}
            />
          ))}
        </List>
      </Box>

      {/* Display restriction if user cannot comment */}
      {!canSendMessage && <CommentRestrictionMessage />}

      {/* Display resolved message if occurrence is resolved */}
      {isResolved && canSendMessage && <ResolvedMessage />}

      {!isResolved && canSendMessage && (
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => {
              handleSendNewMessage(newMessage);
              setNewMessage('');
            }}
            color="primary"
          >
            <SendIcon />
          </IconButton>

          {canChangeStatus && <ChangeStatusActions />}
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
