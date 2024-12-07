import { Box, Typography } from "@mui/material";

const MissionHeader: React.FC = () => {
  const todayDate = new Date();

  const formattedDate = todayDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <>
      <Box
        sx={{
          margin: 1,
          padding: 2,
          background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight="bold"
          color="#fff"
          fontSize={{ xs: "1.4rem", sm: "2rem" }}

          sx={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          🌟 Suas missões diárias 🌟
        </Typography>
      </Box>

      {/* Date Box */}
      <Box
        sx={{
          marginBottom: 1,
          marginLeft: 2,
          padding: 2,
          background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h6"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight="bold"
          color="#fff"
          sx={{
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          📅 {capitalizedDate}
        </Typography>
      </Box>
    </>
  );
};

export default MissionHeader;
