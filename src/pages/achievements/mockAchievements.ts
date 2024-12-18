const mockAchievements = [
  {
    id: 1,
    achievement: {
      name: 'First Steps',
      description: 'Ganhe sua primeira Moedinha!',
      target_points: 1,
      image: 'https://via.placeholder.com/300x150?text=First+Steps',
      unlocked_message: 'You unlocked the First Steps Badge!',
    },
    progress: 1,
    progress_percentage: 100,
    is_claimed: false,
  },
  {
    id: 2,
    achievement: {
      name: 'Master of Moedinhas',
      description: 'Acumule 1.000 Moedinhas!',
      target_points: 1000,
      image: 'https://via.placeholder.com/300x150?text=Master+of+Tasks',
      unlocked_message: 'You unlocked the Master Badge!',
    },
    progress: 1000,
    progress_percentage: 100,
    is_claimed: false,
  },
  {
    id: 3,
    achievement: {
      name: 'Ultimate Achiever',
      description: 'Acumulate 10.000 Moedinhas!',
      target_points: 10000,
      image: 'https://www.bcb.gov.br/novasnotas/assets/img/section/50/50_back.jpg',
      unlocked_message: 'Você ganhou um vale-presente de R$ 50,00!',
    },
    progress: 6300,
    progress_percentage: 63,
    is_claimed: false,
  },
];

export default mockAchievements;
