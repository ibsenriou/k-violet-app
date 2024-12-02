import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Radio from '@mui/material/Radio'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useState } from 'react'

type FilterType = string
type AttributeType =
    | string
    | {
          [key: FilterType]: string
      }

export type PermissionItem = {
    actions?: string[]
    filters?: FilterType[]
    attribute?: AttributeType
    children?: {
        [key: string]: PermissionItem
    }
    create?: {
        filters: FilterType[]
        attribute: AttributeType
    }
    update?: {
        filters: FilterType[]
        attribute: AttributeType
    }
    delete?: {
        filters: FilterType[]
        attribute: AttributeType
    }
    retrieve?: {
        filters: FilterType[]
        attribute: AttributeType
    }
    list?: {
        filters: FilterType[]
        attribute: AttributeType
    }
}

type PermissionTreeProps = {
    permission: PermissionItem
    id?: string
    path: string
    deep: number
    currentSelectedPath?: string
    onSelect?: (path: string, permission: PermissionItem) => void
}

export default function PermissionTree({
    permission,
    id,
    path,
    deep,
    currentSelectedPath,
    onSelect
}: PermissionTreeProps) {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <>
            <ListItem
                sx={{
                    paddingLeft: `${deep * 2}rem`
                }}
            >
                <ListItemIcon>
                    <Radio
                        edge='start'
                        tabIndex={-1}
                        disableRipple
                        onClick={() => onSelect && onSelect(path ? `${path}.${id}` : `${id}`, permission)}
                        checked={(path ? `${path}.${id}` : `${id}`) === currentSelectedPath}
                    />
                </ListItemIcon>
                <ListItemButton onClick={handleClick}>
                    <ListItemText primary={id} />
                    {permission.children && (open ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
            </ListItem>
            {permission.children &&
                Object.entries(permission.children).map(([key, childPermission]) => (
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <PermissionTree
                            permission={{
                                ...childPermission,
                                filters: (childPermission.filters || []).concat(permission.filters || [])
                            }}
                            id={key}
                            path={path ? `${path}.${id}` : `${id}`}
                            deep={deep + 1}
                            currentSelectedPath={currentSelectedPath}
                            onSelect={onSelect}
                        />
                    </Collapse>
                ))}
        </>
    )
}
