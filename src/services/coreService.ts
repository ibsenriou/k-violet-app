// import { UserType } from '@typesApiMapping/apps/userTypes'
import { createUrl } from './Url'

export const CoreService = {
    daily_missions: createUrl<null, any[]>('/core/daily_missions/'),
    daily_missionId_complete: createUrl<{ missionId: number }, any>('/core/daily_missions/:missionId/complete/'),

}
