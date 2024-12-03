import { Card, Box, Typography, IconButton, Dialog, DialogContent, DialogContentText, Button, DialogActions, DialogTitle, useTheme } from '@mui/material';
import { CheckCircle, Cancel, Hotel, AccessTime, StarBorderOutlined } from '@mui/icons-material';
import { useState } from 'react';

interface TaskCardProps {
  title: string;
  points: number;
  onConfirm: () => void;
  onFail: () => void;
  taskCompleted?: boolean;
  taskFailed?: boolean;
}



const TaskCard: React.FC<TaskCardProps> = ({ title, points, onConfirm, onFail, taskCompleted, taskFailed }) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const {
    palette: { mode },
  } = useTheme();
  console.log("theme", mode);

  // Determine the background color based on task status
  const statusColor = taskCompleted ? 'green' : taskFailed ? 'red' : 'neutral';
  const statusBackground = {
    green: (mode === 'light' ? '#c1ffc6' : '#2e7d32'),
    red: (mode === 'light' ? '#fcd7dd' : '#c62828'),
    neutral: (mode === 'light' ? '#f0f3d1' : '#424242'),
  };

  const toggleConfirming = () => {
    setConfirming(true);
    toggleDialog();
  }

  const toggleFailing = () => {
    setConfirming(false);
    toggleDialog();
  }


  const toggleDialog = () => {
    setOpen(!open);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleConfirm = () => {
    if (confirming) {
      onConfirm();
    } else {
      onFail();
    }
    setOpen(false);
  }

  return (
    <>
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        height: 120,
        borderRadius: 2,
        boxShadow: 3,
        margin: 2,
        padding: 2,
        backgroundColor: statusBackground[statusColor], // Apply background color
        position: 'relative', // Position for top-right icons
      }}
    >
      <Box
        sx={{
          padding: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px 0 0 8px',
        }}
      >
        <Hotel sx={{ fontSize: 40 }} />
      </Box>

      <Box width={'70%'}>
        <Typography
          variant="h6"
          fontWeight="bold"
          fontSize="1.05rem"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ marginTop: 'auto', fontWeight: 'bold', color: 'text.secondary' }}
        >
          {points} pontos 💰
        </Typography>
      </Box>

      { (!taskCompleted && !taskFailed) && (

      <Box sx={{ width: '30%' }}>
        <IconButton onClick={toggleConfirming}>
          <CheckCircle sx={{ fontSize: 40, color: 'green' }} />
        </IconButton>
        <IconButton onClick={toggleFailing}>
          <Cancel sx={{ fontSize: 40, color: 'red' }} />
        </IconButton>
      </Box>
      )}

      {/* Status Icon at Top Right */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        {taskCompleted && <StarBorderOutlined sx={{ fontSize: 16, color: 'green' }} />}
        {taskFailed && <Cancel sx={{ fontSize: 16, color: 'red' }} />}
        {(!taskCompleted && !taskFailed) && <AccessTime sx={{ fontSize: 16, color: 'gray' }} />}
      </Box>
    </Card>


    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Marcar tarefa como " + (confirming ? "concluída" : "não concluída")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deseja marcar esta tarefa como {confirming ? "concluída" : "não concluída"}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>

    </>

  );
};

export default TaskCard;
