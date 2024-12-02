// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** Store Imports
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'

// ** Redux Actions Imports
import { fetchData } from 'src/store/apps/condominium/condominium-common-areas'

// ** MUI Imports
import FallbackSpinner from '@core/components/spinner'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Datagrid
import { DataGrid, GridColumns } from '@mui/x-data-grid'

// ** Icon Imports
import CalendarOutline from 'mdi-material-ui/CalendarOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'

// ** Types Imports
import { CondominiumCommonAreaType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaTypes'

// ** HomeSpace Components Imports
import CommonAreaActionsDialog from 'src/views/pages/condominium/condominium-common-areas/list/CommonAreaActionsDialog'

import Tooltip from '@mui/material/Tooltip'

// ** Default CellType interface for the DataGrid
interface CellType {
    row: CondominiumCommonAreaType
}

const defaultColumns = [
    {
        flex: 0.25,
        minWidth: 230,
        field: 'name',
        headerName: 'Nome',
        renderCell: ({ row }: CellType) => {
            const { id, name } = row

            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <Link href={`condominium-common-areas/${id}`} passHref>
                            <Typography
                                noWrap
                                component='a'
                                variant='body2'
                                sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                            >
                                {name}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            )
        }
    },

    {
        flex: 0.25,
        field: 'lotacao',
        minWidth: 150,
        headerName: 'Lotação',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.capacity_of_people} Pessoas
                </Typography>
            )
        }
    },

    {
        flex: 0.25,
        field: 'does_it_requires_reservation',
        minWidth: 200,
        headerName: 'Necessita Reserva?',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                    {(row.does_it_requires_reservation && 'Uso Mediante Reserva') || 'Uso Livre'}
                </Typography>
            )
        }
    }
]

const CommonAreasList = () => {
    // ** State
    const [pageSize, setPageSize] = useState<number>(10)
    const [searchBoxValue, setSearchBoxValue] = useState<string>('')

    // ** Hooks
    const dispatch = useAppDispatch()
    const condominiumCommonAreas = useSelector((state: RootState) => state.condominiumCommonAreas) as { commonAreas: CondominiumCommonAreaType[] }

    // ** Action Dialog Controllers
    const [actionType, setActionType] = useState<'add' | 'edit' | 'delete'>('add')
    const [actionData, setActionData] = useState<CondominiumCommonAreaType>()
    const [commonAreaActionsDialogOpen, setCommonAreaActionsDialogOpen] = useState<boolean>(false)

    const toggleCommonAreaActionsDialog = () => setCommonAreaActionsDialogOpen(!commonAreaActionsDialogOpen)

    const handleCommonAreaAction = (type: 'add' | 'edit' | 'delete', row?: CondominiumCommonAreaType) => {
        setActionType(type)
        setActionData(row)
        toggleCommonAreaActionsDialog()
    }

    useEffect(() => {
        dispatch(fetchData())
    }, [dispatch])

    const handleFilter = useCallback((val: string) => {
        setSearchBoxValue(val)
    }, [])

    // ** Normalize the query values in the searchbox to lowercase for better filtering.
    const queryLowered = searchBoxValue.toLowerCase()

    // ** Loops through the Array of Common Areas applying filters from the Searchbox.
    const filteredData = useMemo(() => {
        return condominiumCommonAreas.commonAreas
            .filter((commonArea: { name: string }) => commonArea.name.toLowerCase().includes(queryLowered))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
    }, [queryLowered, condominiumCommonAreas])

    const columns: GridColumns = [
        ...defaultColumns,
        {
            flex: 0.15,
            minWidth: 135,
            maxWidth: 135,
            disableColumnMenu: true,
            sortable: false,
            field: 'acoes',
            headerName: 'Ações',
            headerAlign: 'center',
            align: 'center',

            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        disabled={!row.does_it_requires_reservation}
                        style={{
                            visibility: row.have_any_reservation_period ? 'visible' : 'hidden'
                        }}
                    >
                        <Link href={`condominium-common-areas/reservations/${row.id}`} passHref>
                            <Tooltip title='Adicionar Reserva' placement='top' arrow>
                                <CalendarOutline fontSize='small' />
                            </Tooltip>
                        </Link>
                    </IconButton>
                    <IconButton>
                        <Link href={`condominium-common-areas/${row.id}`} passHref>
                            <EyeOutline fontSize='small' />
                        </Link>
                    </IconButton>
                    <IconButton onClick={() => handleCommonAreaAction('delete', row)}>
                        <DeleteOutline fontSize='small' />
                    </IconButton>
                </Box>
            )
        }
    ]

    if (!filteredData) {
        return <FallbackSpinner />
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <Box
                        sx={{
                            p: 5,
                            pb: 3,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TextField
                            size='small'
                            value={searchBoxValue}
                            sx={{ mr: 4, mb: 2 }}
                            placeholder='Buscar Área Comum'
                            onChange={e => handleFilter(e.target.value)}
                        />
                        <Button sx={{ mb: 2 }} onClick={() => handleCommonAreaAction('add')} variant='contained'>
                            Adicionar Área Comum
                        </Button>
                    </Box>
                    <DataGrid
                        componentsProps={{
                            pagination: {
                                labelRowsPerPage: 'Linhas por página'
                            }
                        }}
                        localeText={{ noRowsLabel: 'Nenhuma área comum encontrada!' }}
                        autoHeight
                        rows={filteredData}
                        pageSize={pageSize}
                        disableSelectionOnClick
                        columns={columns}
                        rowsPerPageOptions={[10, 25, 50]}
                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                    />
                </Card>
            </Grid>

            <CommonAreaActionsDialog
                open={commonAreaActionsDialogOpen}
                toggle={toggleCommonAreaActionsDialog}
                actionType={actionType}
                actionData={actionData}
            />
        </Grid>
    )
}

export default CommonAreasList
