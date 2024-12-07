import Box from "@mui/material/Box";
import MissionCard from "./components/MissionCard";
import MissionHeader from "./components/MissionHeader";
import Typography from "@mui/material/Typography";

const Activities = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        width: "100%",
        maxWidth: "400px",
        margin: "1 auto",
      }}
    >
      <MissionHeader />

      {/* Celebration Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "1rem",
          background: "linear-gradient(135deg, #ffdd67, #f78fb3)",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          border: "2px dashed #fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Sparkles */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "80%",
            height: "80%",
            background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
            animation: "pulse 3s infinite",
            zIndex: 0,
          }}
        ></Box>

        <Typography
          variant="h5"
          fontFamily="Comic Sans MS, sans-serif"
          fontWeight="bold"
          sx={{
            zIndex: 1,
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          🎉 Parabéns! Você completou todas as missões de hoje! 🎉
        </Typography>
        <Typography
          variant="body1"
          fontFamily="Comic Sans MS, sans-serif"
          fontWeight="bold"
          sx={{
            zIndex: 1,
            color: "#fff",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          }}
        >
          Volte amanhã para mais missões incríveis! 🚀
        </Typography>
      </Box>

      {/* Mission Cards */}
      <MissionCard
        title="Ler 1 capítulo do livro 'O pequeno príncipe' antes do almoço"
        points={50}
        onConfirm={() => console.log("Confirm")}
        taskCompleted={false}
      />
      <MissionCard
        title="Fazer 30 minutos de exercícios"
        points={100}
        onConfirm={() => console.log("Confirm")}
        taskCompleted={false}
      />
      <MissionCard
        title="Estudar 1 hora de inglês"
        points={200}
        onConfirm={() => console.log("Confirm")}
        taskCompleted={true}
      />
      <MissionCard
        title="Fazer 30 minutos de meditação"
        points={150}
        onConfirm={() => console.log("Confirm")}
        taskCompleted={true}
      />
      <MissionCard
        title="Ajudar a lavar a louça"
        points={150}
        onConfirm={() => console.log("Confirm")}
        taskCompleted={true}
      />
    </Box>
  );
};

export default Activities;
