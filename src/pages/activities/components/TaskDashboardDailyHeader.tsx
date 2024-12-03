// TaskDashboardHeader.tsx
'use client';

import { Box, Typography } from "@mui/material";


const TaskDashboardDailyHeader: React.FC = () => {

    const todayDate = new Date();

    const formattedDate = todayDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);


  return (
    <>
    <Box  sx={{margin: 2, padding: 2}}>
      <Typography variant="h4" fontFamily='sans-serif' fontWeight='bold'>
        Suas tarefas diárias
      </Typography>
    </Box>

    <Box sx={{marginBottom: 2, marginLeft: 2, padding: 2}}>
      <Typography variant="h6" fontFamily='sans-serif' color='GrayText' fontWeight='bold'>
        {capitalizedDate}
      </Typography>
    </Box>
    </>
  );
};

export default TaskDashboardDailyHeader;
