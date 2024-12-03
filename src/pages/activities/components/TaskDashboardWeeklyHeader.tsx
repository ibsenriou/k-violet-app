// TaskDashboardWeeklyHeader.tsx
'use client';

import { Typography } from "@mui/material";

const TaskDashboardWeeklyHeader: React.FC = () => {
  // Get today's date
  const today = new Date();

  // Calculate the first day of the current week (Sunday)
  const currentWeekFirstDayStartingBySunday = new Date(today);
  currentWeekFirstDayStartingBySunday.setDate(today.getDate() - today.getDay()); // Sunday of the current week

  // Calculate the last day of the current week (Saturday)
  const currentWeekLastDayAtSaturday = new Date(today);
  currentWeekLastDayAtSaturday.setDate(today.getDate() + (6 - today.getDay())); // Saturday of the current week

  // Format the dates to display
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const formattedStart = currentWeekFirstDayStartingBySunday.toLocaleDateString('pt-BR', options);
  const formattedEnd = currentWeekLastDayAtSaturday.toLocaleDateString('pt-BR', options);

  return (
    <>
      <div className="flex justify-center p-4 uppercase">
        <Typography className="font-sans" variant="h5" component="div">
          Suas tarefas Semanais
        </Typography>
      </div>

      <div className="flex justify-center p-4">
        <Typography className="font-sans" variant="h6" component="div">
          Semana de {formattedStart} a {formattedEnd}
        </Typography>
      </div>
    </>
  );
};

export default TaskDashboardWeeklyHeader;
