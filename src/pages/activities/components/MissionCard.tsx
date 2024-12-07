import {
  Card,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { Task } from "@mui/icons-material";
import { useState } from "react";
import MissionStatusButton from "./MissionStatusButton";
import MissionCompleteDialog from "./MissionCompleteDialog";

interface MissionCardProps {
  title: string;
  points: number;
  onConfirm: () => void;
  taskCompleted: boolean;
}

const TaskCard: React.FC<MissionCardProps> = ({ title, points, onConfirm, taskCompleted }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const { mode } = theme.palette;

  // Colors for light and dark modes
  const statusBackgroundColors = {
    completed: "linear-gradient(135deg, #a8ff78, #78ffd6)", // Bright gradient for completed
    pending: "linear-gradient(135deg, #ff9a9e, #fecfef)", // Bright gradient for pending
  };

  const toggleDialog = () => setDialogOpen((prev) => !prev);

  const handleConfirm = () => {
    onConfirm();
    setDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          width: "100%",
          height: 140,
          borderRadius: 3,
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          margin: 1,
          padding: 2,
          background: taskCompleted
            ? statusBackgroundColors.completed
            : statusBackgroundColors.pending,
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
            animation: "spin 10s linear infinite",
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
            borderRadius: "8px 0 0 8px",
            width: "25%",
            padding: 1,
          }}
        >
          <Task sx={{ fontSize: 50, color: taskCompleted ? "#2ecc71" : "#e74c3c" }} />
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: "1.1rem",
              color: "#fff",
              textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          {/* Points */}
          <Typography
            variant="body1"
            fontWeight="bold"
            marginTop='auto'
            sx={{
              color: "#ffeb3b",
              textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {points} moedinhas 💰
          </Typography>
        </Box>

        {/* Mission Button */}
        {!taskCompleted && (
          <MissionStatusButton
            onClick={toggleDialog}
            mode={mode}
            sx={{
              background: "linear-gradient(135deg, #fbc7d4, #cc96f0)",
              color: "#fff",
              fontWeight: "bold",
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #b187ce, #fbc7d4)",
              },
            }}
          />
        )}
      </Card>

      {/* Dialog */}
      {dialogOpen && (
        <MissionCompleteDialog
          dialogOpen={dialogOpen}
          toggleDialog={toggleDialog}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default TaskCard;
