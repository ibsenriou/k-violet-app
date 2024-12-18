export type AchievementType = {
  id: number
  name: string
  description: string
  target_points: number
  image: string
  unlocked_message: string
  is_secret: boolean
}

export type UserAchievementType = {
  id: number
  fk_achievement: number
  achievement: AchievementType
  fk_user: number
  progress: number
  progress_percentage: number
  is_claimed: boolean
}
