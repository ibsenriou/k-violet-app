import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { AbilityContext } from 'src/layouts/components/acl/Can'

/**
 * A custom React hook designed to encapsulate the behavior of checking permissions
 * and rendering buttons based on those permissions, specifically tailored for use
 * in applications employing role-based access control (RBAC) with the Casl library.
 *
 * @param resource - The resource or subject for which permissions are being checked.
 * @param row - The data object representing the current row or item for which buttons are being rendered.
 * @param setActionTypeHandler - A function to handle actions triggered by button clicks,
 * typically used to perform actions such as adding, editing, deleting, or viewing items.
 *
 * @returns A JSX element representing a container with rendered buttons based on the user's permissions for the specified resource.
 */
const usePermissionActionButtons = (
    resource: string,
    row: any,
    setActionTypeHandler: (action: 'add' | 'edit' | 'delete' | 'view', row: any) => void
) => {
    const ability = useContext(AbilityContext)

    const renderButtons = () => {
        const buttons = []
        buttons.push(
            <IconButton key='view' onClick={() => setActionTypeHandler('view', row)}>
                <EyeOutline fontSize='small' />
            </IconButton>
        )
        buttons.push(
            <IconButton key='edit' onClick={() => setActionTypeHandler('edit', row)}>
                <PencilOutline fontSize='small' />
            </IconButton>
        )
        buttons.push(
            <IconButton key='delete' onClick={() => setActionTypeHandler('delete', row)}>
                <DeleteOutline fontSize='small' />
            </IconButton>
        )

        return buttons
    }

    return <Box sx={{ display: 'flex', alignItems: 'center' }}>{renderButtons()}</Box>
}

export default usePermissionActionButtons
