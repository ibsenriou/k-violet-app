import Box from "@mui/material/Box";
import MissionCard from "./components/MissionCard";
import MissionHeader from "./components/MissionHeader";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CoreService } from "src/services/coreService";
import FallbackSpinner from "@core/components/spinner";
import { useState } from "react";

const DailyMissions = () => {
  const queryClient = useQueryClient();
  const [optimisticMissions, setOptimisticMissions] = useState<number[]>([]);

  const dailyMissionsQuery = useQuery({
    queryKey: ["dailyMissions"],
    queryFn: () =>
      CoreService.daily_missions.get().then((response) => response.data),
    select: (response) => response.results,
  });

  const completeMissionMutation = useMutation({
    mutationFn: (missionId: number) =>
      CoreService.daily_missionId_complete.post({ missionId }, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyMissions"] });
      queryClient.invalidateQueries({ queryKey: ["userCoins"] });
    },
    onError: (missionId: number) => {
      console.error("Error completing the mission. Please try again later.");

      // Remove mission from optimistic updates on error
      setOptimisticMissions((prev) => prev.filter((id) => id !== missionId));
    },
  });

  const handleCompleteMission = (id: number) => {
    // Optimistically mark as completed
    setOptimisticMissions((prev) => [...prev, id]);
    completeMissionMutation.mutate(id);
  };

  const isLoading = dailyMissionsQuery.isLoading;

  const missionsList =
    dailyMissionsQuery.data?.sort((a, b) => {
      if (a.is_completed && !b.is_completed) return 1;
      if (!a.is_completed && b.is_completed) return -1;

return 0;
    }) || [];

  const missionsAllCompleted = missionsList.every(
    (mission) => mission.is_completed || optimisticMissions.includes(mission.id)
  );

  if (isLoading) return <FallbackSpinner />;

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

      {missionsAllCompleted && (
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
      )}

      {missionsList.map((mission, index) => (
        <MissionCard
          key={index}
          description={mission.description}
          points={mission.points}
          is_completed={
            mission.is_completed || optimisticMissions.includes(mission.id)
          }
          onConfirm={() => handleCompleteMission(mission.id)}
          isLoading={optimisticMissions.includes(mission.id)} // Pass loading state
        />
      ))}
    </Box>
  );
};

export default DailyMissions;
