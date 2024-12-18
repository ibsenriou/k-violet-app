import { Container, Typography } from '@mui/material';
import AchievementCard from './components/AchievementCard';

import FallbackSpinner from '@core/components/spinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CoreService } from 'src/services/coreService';

const AchievementsPage = () => {
  const userAchievementsQuery = useQuery({
    queryKey: ['userAchievements'],
    queryFn: () => CoreService.user_achievements.get().then(response => response.data),
    select: data => data.results
  })

  const queryClient = useQueryClient()

  const claimAchievementMutation = useMutation({
    mutationFn: (achievementId: number) =>
      CoreService.user_achievementId_claim.post({ achievementId }, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAchievements"] });
    },
    onError: () => {
      console.error("Error claiming the achievement. Please try again later.");
    },
  });


  const userAchievements = userAchievementsQuery.data || []

  console.log("userAchievementsQuery", userAchievementsQuery.data)
  console.log("userAchievements", userAchievements)

  const isLoading = userAchievementsQuery.isLoading

  if (isLoading) return <FallbackSpinner />;

  const handleRedeem = (id: number) => {
    claimAchievementMutation.mutate(id)
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Suas Conquistas
      </Typography>
      {userAchievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          handleRedeem={handleRedeem}
        />
      ))}
    </Container>
  );
};

export default AchievementsPage;
