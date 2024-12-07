import { authSlice } from './apps/auth'

import { appEmailSlice } from './apps/email'
import { appInvoiceSlice } from './apps/invoice'
import { appPermissionsSlice } from './apps/permissions'
import { appUsersSlice } from './apps/user'

const slices = {
    auth: authSlice,
    user: appUsersSlice,

    email: appEmailSlice,
    invoice: appInvoiceSlice,
    permissions: appPermissionsSlice,

}

export default slices
