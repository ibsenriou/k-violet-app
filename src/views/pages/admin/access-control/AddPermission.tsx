import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Close from 'mdi-material-ui/Close'
import { AccessControlService } from 'src/services/accessControlService'
import PermissionTree, { PermissionItem } from './components/PermissionTree'
import { useState } from 'react'
import { LookupsService } from 'src/services/lookupsService'
import LoadingButton from '@core/components/loading-button'

type AddPermissionProps = {
    roleId: string
    onCancel: () => void
    onConfirm: () => void
}

function Filter({ type, value, onChange }: { type: string; value: any; onChange: (e: any) => void }) {
    const lookupUhabUserRole = useQuery({
        queryKey: ['lookup_type_of_uhab_user_role'],
        queryFn: async () => {
            return LookupsService.lookup_type_of_uhab_user_role.get()
        },
        select: response => response.data.results
    })

    if (type == 'UHAB_USER_ROLE') {
        return (
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <FormControlLabel
                    key={type}
                    control={
                        <Checkbox
                            checked={value[type]}
                            onChange={e => {
                                onChange({
                                    ...value,
                                    [type]: e.target.checked ? {} : undefined
                                })
                            }}
                        />
                    }
                    label={type}
                />
                <Select
                    value={value[type]?.value}
                    onChange={e => {
                        onChange({
                            ...value,
                            [type]: {
                                value: e.target.value
                            }
                        })
                    }}
                    variant='outlined'
                    size={'small'}
                >
                    {(lookupUhabUserRole.data || []).map(item => (
                        <MenuItem
                            key={String(item.id)}
                            value={item.description as unknown as string}
                            selected={item.description == value}
                        >
                            {item.description}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        )
    }

    return (
        <FormControlLabel
            key={type}
            control={
                <Checkbox
                    checked={value[type]}
                    onChange={e => {
                        onChange({
                            ...value,
                            [type]: e.target.checked ? {} : undefined
                        })
                    }}
                />
            }
            label={type}
        />
    )
}

function generatePermissionString(data: any) {
    let permission = data.selectedPath
    if (data.considerSubmodules) {
        permission += '.*'
    }
    if (Object.keys(data.filters).length) {
        permission += Object.entries(data.filters)
            .filter(([key, value]: any) => value)
            .map(([key, value]: any) => {
                return value?.value ? `[${key}=${value?.value}]` : `[${key}]`
            })
            .join('')
    }
    if (Object.keys(data.actionValues).length) {
        permission += ':'
        if (Object.entries(data.actionValues).filter(([key, value]) => value).length == 5) {
            permission += '*'
        } else {
            permission += Object.entries(data.actionValues)
                .filter(([key, value]) => value)
                .map(([key, value]: any) => {
                    return (
                        key +
                        (Object.entries(value).filter(([key, value]: any) => value).length
                            ? Object.entries(value)
                                  .filter(([key, value]: any) => value)
                                  .map(([key, value]: any) => (value?.value ? `[${key}=${value?.value}]` : `[${key}]`))
                                  .join('')
                            : '')
                    )
                })
                .join(',')
        }
    }
    return permission
}

export default function AddPermission({ onCancel, roleId }: AddPermissionProps) {
    const queryClient = useQueryClient()
    const [selectedPath, setSelectedPath] = useState<string | null>(null)
    const [permissionObject, setPermissionObject] = useState<PermissionItem | null>(null)
    const [considerSubmodules, setConsiderSubmodules] = useState(false)
    const [actionValues, setActionValues] = useState<any>({})
    const [filters, setFilters] = useState<any>({})

    const permissionQuery = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            return AccessControlService.permission.get()
        },
        select: response => response.data
    })

    const mutationPermission = useMutation({
        mutationFn: async () => {
            const stringPermission = generatePermissionString({
                selectedPath: selectedPath,
                considerSubmodules: considerSubmodules,
                actionValues: actionValues,
                filters: filters
            })
            return AccessControlService.role_permission.post(
                {
                    roleId: roleId
                },
                {
                    permission: stringPermission,
                    fk_role: roleId
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['roles', roleId, 'permissions']
            })
            onCancel()
        }
    })

    return (
        <Dialog fullWidth maxWidth='md' scroll='body' open onClose={onCancel}>
            <DialogTitle sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => onCancel()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        Adicionar Permissão
                    </Typography>
                    <Typography variant='body2'>Insira uma permissão para esser perfil.</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        marginX: 8
                    }}
                >
                    <List
                        sx={{
                            width: '100%',
                            overflow: 'auto',
                            maxHeight: 300,
                            paddingX: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1
                        }}
                        component='nav'
                        aria-labelledby='nested-list-subheader'
                        subheader={
                            <ListSubheader component='div' id='nested-list-subheader'>
                                Permissões
                            </ListSubheader>
                        }
                    >
                        {Object.entries(permissionQuery.data || {}).map(([key, value]) => (
                            <PermissionTree
                                deep={0}
                                key={key}
                                id={key}
                                path={''}
                                permission={value as PermissionItem}
                                currentSelectedPath={selectedPath || ''}
                                onSelect={(path, permission) => {
                                    setSelectedPath(path)
                                    setPermissionObject(permission)
                                    setConsiderSubmodules(false)
                                    setActionValues({})
                                    setFilters({})
                                }}
                            />
                        ))}
                    </List>

                    {permissionObject?.children && (
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={considerSubmodules}
                                        onChange={e => setConsiderSubmodules(e.target.checked)}
                                    />
                                }
                                label='Considerar Submodulos?'
                            />
                        </Box>
                    )}
                    {Boolean(permissionObject?.filters?.length) && (
                        <Box>
                            <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
                                <FormLabel component='legend'>Filtros</FormLabel>
                                {permissionObject &&
                                    (permissionObject.filters || []).map(value => (
                                        <Filter
                                            key={value}
                                            type={value}
                                            value={filters}
                                            onChange={e => setFilters(e)}
                                        />
                                    ))}
                            </FormControl>
                        </Box>
                    )}
                    {!considerSubmodules ? (
                        permissionObject && (
                            <Box>
                                <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
                                    <FormLabel component='legend'>Ações</FormLabel>
                                    {permissionObject &&
                                        (permissionObject.actions || []).map(value =>
                                            value in permissionObject ? (
                                                <Box>
                                                    <FormControlLabel
                                                        key={value}
                                                        control={
                                                            <Checkbox
                                                                checked={actionValues[value]}
                                                                onChange={e =>
                                                                    setActionValues({
                                                                        ...actionValues,
                                                                        [value]: e.target.checked ? {} : undefined
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        label={value}
                                                    />
                                                    {actionValues[value] && (
                                                        <Box
                                                            sx={{
                                                                borderLeft: '1px solid #e0e0e0',
                                                                marginLeft: 4
                                                            }}
                                                        >
                                                            <FormControl
                                                                sx={{ m: 3 }}
                                                                component='fieldset'
                                                                variant='standard'
                                                            >
                                                                <FormLabel component='legend'>Filtros</FormLabel>
                                                                {((permissionObject as any)[value].filters || []).map(
                                                                    (filterValue: string) => (
                                                                        <Filter
                                                                            key={filterValue}
                                                                            type={filterValue}
                                                                            value={actionValues[value]}
                                                                            onChange={e =>
                                                                                setActionValues({
                                                                                    ...actionValues,
                                                                                    [value]: e
                                                                                })
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </FormControl>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : (
                                                <FormControlLabel
                                                    key={value}
                                                    control={
                                                        <Checkbox
                                                            checked={actionValues[value]}
                                                            onChange={e =>
                                                                setActionValues({
                                                                    ...actionValues,
                                                                    [value]: e.target.checked ? {} : undefined
                                                                })
                                                            }
                                                        />
                                                    }
                                                    label={value}
                                                />
                                            )
                                        )}
                                </FormControl>
                            </Box>
                        )
                    ) : (
                        <Box>
                            <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
                                <FormLabel component='legend'>Ações</FormLabel>
                                {['retrieve', 'list', 'create', 'update', 'delete'].map(value => (
                                    <FormControlLabel
                                        key={value}
                                        control={
                                            <Checkbox
                                                checked={actionValues[value]}
                                                onChange={e =>
                                                    setActionValues({
                                                        ...actionValues,
                                                        [value]: e.target.checked ? {} : undefined
                                                    })
                                                }
                                            />
                                        }
                                        label={value}
                                    />
                                ))}
                            </FormControl>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{ marginRight: 1 }}
                    loading={Boolean(mutationPermission?.isPending)}
                    onClick={() => mutationPermission?.mutate()}
                    color='primary'
                >
                    Salvar
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
