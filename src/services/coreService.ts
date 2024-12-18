// import { UserType } from '@typesApiMapping/apps/userTypes'
import { DailyMissionType } from '@typesApiMapping/apps/dailyMissionTypes'
import { StoreItemType } from '@typesApiMapping/apps/storeItemTypes'
import { UserAchievementType } from '@typesApiMapping/apps/userAchievementTypes'
import { createUrl } from './Url'

export const CoreService = {
    daily_missions: createUrl<null, DailyMissionType[]>('/core/daily_missions/'),
    daily_missionId_complete: createUrl<{ missionId: number }, DailyMissionType>('/core/daily_missions/:missionId/complete/'),
    store_items: createUrl<null, StoreItemType[]>('/core/store_items/'),
    store_itemId_buy: createUrl<{ itemId: number }, StoreItemType>('/core/store_items/:itemId/buy/'),
    user_achievements: createUrl<null, UserAchievementType[]>('/core/user_achievements/'),
    user_achievementId_claim: createUrl<{ achievementId: number }, UserAchievementType>('/core/user_achievements/:achievementId/claim/'),
}
