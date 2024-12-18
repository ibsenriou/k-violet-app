import { Button, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { UserAchievementType } from '@typesApiMapping/apps/userAchievementTypes';

interface AchievementCardProps {
  achievement: UserAchievementType;
  handleRedeem: (id: number) => void;
}

const AchievementCard = ({ achievement, handleRedeem }: AchievementCardProps) => {

  const progressPercentage = achievement.progress_percentage;
  const isClaimable = progressPercentage >= 100 && !achievement.is_claimed;

  // Preload image if its redeemable to lower the time to show the image
  if (isClaimable) {
    new Image().src = '/images/achievements/' + achievement.achievement.image;
  }

  return (
    <Card style={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography variant="h6">{achievement.achievement.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {achievement.achievement.description}
        </Typography>
        {achievement.is_claimed && (
        <img
          src={'/images/achievements/' + achievement.achievement.image}
          alt={achievement.achievement.name}
          style={{ maxWidth: '100%', margin: '16px 0' }}
        />
        )}
        <LinearProgress variant="determinate" value={progressPercentage} />
        <Typography variant="body2" style={{ marginTop: '8px' }}>
          {achievement.progress}/{achievement.achievement.target_points} Moedinhas
        </Typography>
        {isClaimable && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRedeem(achievement.id)}
            style={{ marginTop: '16px' }}
          >
            Resgatar Recompensa
          </Button>
        )}
        {achievement.is_claimed && (
          <Typography variant="body2" style={{ marginTop: '16px', color: 'green' }}>
            🎉 {achievement.achievement.unlocked_message} 🎉
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
