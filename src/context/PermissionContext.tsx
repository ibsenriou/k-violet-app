import { useQuery } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'


export const PermissionContext = createContext<{
    can: (permission: string, attributes?: { [key: string]: string }) => boolean
    canWithAttributes: (permission: string, attributes?: { [key: string]: string }) => [boolean, string[][]]
    canModule: (permission: string, attributes?: { [key: string]: string }) => boolean
}>({
    can: () => false,
    canWithAttributes: () => [false, [[]]],
    canModule: () => false
})

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
    // const permissionQuery = useQuery({
    //     queryKey: ['access_control'],
    //     queryFn: async () => {
    //         return AccessControlService.user_role_permissions.get()
    //     },
    //     select: response => response.data
    // })

    const canWithAttributes = useCallback(
        (componentPermissionAndAction: string, attributes?: { [key: string]: string }): [boolean, string[][]] => {
            const resolvedPermissions: string[] = []

            const [componentPermission, action] = componentPermissionAndAction.split(':')
            const componentPermissionPath = componentPermission.split('.')
            const matchedAttributes = []
            let hasPermission = false

            for (let i = 0; i < componentPermissionPath.length; i++) {
                const slicedPath = componentPermissionPath.slice(0, i + 1).join('.')
                for (const resolvedPermissionAndAction of resolvedPermissions) {
                    const filters = [] as string[]
                    let match
                    const localMatchedAttributes = []
                    const regex = /\[([^\]]+)\]/g
                    while ((match = regex.exec(resolvedPermissionAndAction)) !== null) {
                        filters.push(match[1])
                    }
                    if (filters && attributes) {
                        let attributesMatch = true
                        for (const filter of filters) {
                            const [key, value] = filter.split('=')
                            if (attributes && attributes[key] !== value) {
                                attributesMatch = false
                                break
                            } else {
                                localMatchedAttributes.push(filter)
                            }
                        }
                        if (!attributesMatch) {
                            continue
                        }
                    }
                    const [resolvedPermission, resolvedAction] = resolvedPermissionAndAction.split(':')
                    const resolvedActionWithoutFilter = resolvedAction.replace(/\[[^\]]*\]/g, '')
                    const resolvedPermissionWithoutFilters = resolvedPermission.replace(/\[[^\]]*\]/g, '')
                    if (resolvedPermissionWithoutFilters.startsWith(slicedPath)) {
                        const slicedResolvedPermission = resolvedPermissionWithoutFilters.replace(`${slicedPath}`, '')
                        if (
                            slicedResolvedPermission === '.*' ||
                            (i === componentPermissionPath.length - 1 && slicedResolvedPermission === '')
                        ) {
                            if (resolvedActionWithoutFilter === '*' || resolvedActionWithoutFilter === action) {
                                matchedAttributes.push(localMatchedAttributes)
                                hasPermission = true
                            }
                        }
                    }
                }
            }

            return [hasPermission, matchedAttributes]
        },
        []
    )

    const can = useCallback(
        (componentPermissionAndAction: string, attributes?: { [key: string]: string }): boolean => {
            return canWithAttributes(componentPermissionAndAction, attributes)[0]
        },
        []
    )

    const canModule = useCallback(
        (componentPermission: string) => {
            const resolvedPermissions: string[] = []
            if (resolvedPermissions.length === 0) {
                return false
            }

            function checkPermission(path: string): boolean {
                if (path === '') return false

return (
                    resolvedPermissions.some(permission => permission.startsWith(`${path}.*`)) ||
                    checkPermission(path.split('.').slice(0, -1).join('.'))
                )
            }

            return (
                resolvedPermissions.some(permission => permission.startsWith(componentPermission)) ||
                checkPermission(componentPermission)
            )
        },

        []
    )

    const contextValue = useMemo(() => ({ can, canModule, canWithAttributes }), [can, canModule, canWithAttributes])

    const _children = useMemo(() => children, [children])

return <PermissionContext.Provider value={contextValue}>{_children}</PermissionContext.Provider>
}

export const usePermission = (defaultPermission?: string, defaultAttributes?: { [key: string]: string }) => {
    const obj = useContext(PermissionContext)

    return {
        can: (permission: string, attributes?: { [key: string]: string }) =>
            obj.can(defaultPermission ? [defaultPermission, permission].join('.') : permission, {
                ...defaultAttributes,
                ...attributes
            }),
        canWithAttributes: (permission: string, attributes?: { [key: string]: string }) =>
            obj.canWithAttributes(defaultPermission ? [defaultPermission, permission].join('.') : permission, {
                ...defaultAttributes,
                ...attributes
            }),
        canModule: obj.canModule
    }
}

export const Can = ({
    permission,
    attributes,
    children
}: {
    permission: string
    attributes?: { [key: string]: string }
    children: React.ReactNode
}) => {
    const { can } = usePermission()

    return can(permission, attributes) ? <>{children}</> : null
}
