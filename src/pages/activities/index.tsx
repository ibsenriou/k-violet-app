import Box from "@mui/material/Box";
import TaskCard from "./components/TaskCard";
import TaskDashboardDailyHeader from "./components/TaskDashboardDailyHeader";

const Activities = () => {
  return (
    <Box>

      <TaskDashboardDailyHeader />
      <TaskCard
        title="Ler 1 capítulo do livro O pequeno príncipe"
        points={50}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
      />
      <TaskCard
        title="Fazer 30 minutos de exercícios"
        points={100}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
        taskCompleted
      />
      <TaskCard
        title="Estudar 1 hora de inglês"
        points={200}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
        taskFailed
      />
      <TaskCard
        title="Fazer 30 minutos de meditação"
        points={150}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
      />
      <TaskCard
        title="Fazer 30 minutos de meditação"
        points={150}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
      />
      <TaskCard
        title="Fazer 30 minutos de meditação"
        points={150}
        onConfirm={() => console.log('Confirm')}
        onFail={() => console.log('Fail')}
      />
    </Box>
  );
}

export default Activities;
