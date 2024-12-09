import { Card, Box, Typography } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

interface UserCoinsCardProps {
  availableCoins: number;
}

const UserCoinsCard: React.FC<UserCoinsCardProps> = ({ availableCoins }) => {

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 120,
        borderRadius: 3,
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
        margin: 2,
        padding: 2,
        background: "linear-gradient(135deg, #f9d423, #ff4e50)",
        position: "relative",
        overflow: "hidden",
        transform: "scale(1)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {/* Sparkling Animation */}
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.3) 15%, transparent 60%)",
          animation: "spin 15s linear infinite",
          pointerEvents: "none",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />

      {/* Icon Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "20%",
        }}
      >
        <EmojiEvents
          sx={{
            fontSize: 60,
            color: "#ffd700",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flexGrow: 1,
          paddingLeft: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            fontSize: "1.4rem",
            color: "#fff",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
          }}
        >
          Suas Moedinhas:
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: "1.8rem",
            color: "#ffeb3b",
            textShadow: "2px 2px 5px rgba(0,0,0,0.4)",
          }}
        >
          {availableCoins} 💰
        </Typography>
      </Box>
    </Card>
  );
};

export default UserCoinsCard;
