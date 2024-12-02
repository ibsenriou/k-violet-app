import { UserRoleType } from '@typesApiMapping/apps/access-control/userRoleTypes'
import { createUrl } from './Url'
import { RoleType } from '@typesApiMapping/apps/access-control/roleTypes'

export const AccessControlService = {
    role: createUrl<null, RoleType[]>('/access_control/role/'),
    role_id: createUrl<{ roleId: string }, any>('/access_control/role/:roleId/'),
    role_permission: createUrl<{ roleId: string }, any>('/access_control/role_permission/?fk_role=:roleId'),
    role_permission_id: createUrl<{ id: string }, any>('/access_control/role_permission/:id/'),
    permission: createUrl<null, any>('/access_control/permission/'),
    user_role: createUrl<null, UserRoleType[]>('/access_control/user_role/'),
    user_role_id: createUrl<{ id: string }, any>('/access_control/user_role/:id/'),
    user_role_permissions: createUrl<{ userId: string }, any>('/access_control/user_role_permissions/')
}
