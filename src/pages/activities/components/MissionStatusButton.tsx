import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CheckCircle } from '@mui/icons-material';

interface MissionStatusButtonProps {
  onClick: () => void;
  mode: 'light' | 'dark';
  sx?: object; // Accept additional sx props
}

const MissionStatusButton: React.FC<MissionStatusButtonProps> = ({ onClick, mode, sx = {} }) => (
  <Box
    sx={{
      width: '20%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
      borderRadius: '8px',
      backgroundColor: mode === 'light' ? '#dddada' : '#3a3a3a',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease',
      '&:active': {
        backgroundColor: '#d9ffd9',
      },
      ...sx, // Merge passed sx props with default styles
    }}
    onClick={onClick}
    aria-label="Marcar tarefa como concluída"
  >
    <CheckCircle sx={{ fontSize: 40, color: 'green' }} />
    <Typography
      variant="button"
      sx={{ color: 'green', mt: 1, textAlign: 'center', fontSize: '0.6rem' }}
    >
      Completo
    </Typography>
  </Box>
);

export default MissionStatusButton;
