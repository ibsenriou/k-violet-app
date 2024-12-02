import { authSlice } from './apps/auth'
import { appCalendarSlice } from './apps/calendar'
import { appChatSlice } from './apps/chat'
import { appCondominiumAboutTheCondominiumSlice } from './apps/condominium/about-the-condominium'
import { pagesCondominiumCommonAreaDetailSlice } from './apps/condominium/condominium-common-area-detail'
import { appCondominiumCondominiumCommonAreasSlice } from './apps/condominium/condominium-common-areas'
import { appCondominiumResidentialDetailSlice } from './apps/condominium/residentialDetail'
import { appCondominiumResidentialSlice } from './apps/condominium/residentials'
import { appEmailSlice } from './apps/email'
import { appInvoiceSlice } from './apps/invoice'
import { appPermissionsSlice } from './apps/permissions'
import { appUsersSlice } from './apps/user'

const slices = {
    auth: authSlice,
    user: appUsersSlice,
    chat: appChatSlice,
    email: appEmailSlice,
    invoice: appInvoiceSlice,
    permissions: appPermissionsSlice,
    calendar: appCalendarSlice,
    aboutTheCondominium: appCondominiumAboutTheCondominiumSlice,
    residentialDetail: appCondominiumResidentialDetailSlice,
    residentials: appCondominiumResidentialSlice,
    condominiumCommonAreas: appCondominiumCondominiumCommonAreasSlice,
    condominiumCommonAreaDetail: pagesCondominiumCommonAreaDetailSlice
}

export default slices
