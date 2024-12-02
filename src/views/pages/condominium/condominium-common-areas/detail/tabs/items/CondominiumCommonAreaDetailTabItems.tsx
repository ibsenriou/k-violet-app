// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'

// ** Redux Store

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

// ** Icon Imports
import IconButton from '@mui/material/IconButton'

// ** Type Imports
import { CondominiumCommonAreaItemType } from '@typesApiMapping/apps/condominium/condominiumCommonAreaItemTypes'

// ** Custom Components Imports
import FallbackSpinner from '@core/components/spinner'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { fetchData } from 'src/store/apps/condominium/condominium-common-area-detail'
import CondominiumCommonAreaItemActionsDialog from './actionDialog/CondominiumCommonAreaItemActionsDialog'

const CondominiumCommonAreaDetailTabItems = () => {
    // ** State
    const [searchBoxValue, setSearchBoxValue] = useState<string>('')

    // ** Redux State
    const dispatch = useAppDispatch()
    const store = useSelector((state: RootState) => state.condominiumCommonAreaDetail)

    // ** Action Dialog Controllers
    const [actionType, setActionType] = useState<'add' | 'view' | 'edit' | 'delete'>('add')
    const [actionData, setActionData] = useState<CondominiumCommonAreaItemType>({} as CondominiumCommonAreaItemType)
    const [CondominiumCommonAreaItemActionsDialogOpen, setCondominiumCommonAreaItemActionsDialogOpen] =
        useState<boolean>(false)

    const toggleCondominiumCommonAreaItemActionsDialog = () =>
        setCondominiumCommonAreaItemActionsDialogOpen(!CondominiumCommonAreaItemActionsDialogOpen)

    const handleCondominiumCommonAreaItemAction = (
        type: 'add' | 'view' | 'edit' | 'delete',
        row: CondominiumCommonAreaItemType = {} as CondominiumCommonAreaItemType
    ) => {
        setActionType(type)
        setActionData(row)
        toggleCondominiumCommonAreaItemActionsDialog()
    }

    const addCondominiumCommonAreaItemHandler = () => handleCondominiumCommonAreaItemAction('add')
    const viewCondominiumCommonAreaItemHandler = (row: CondominiumCommonAreaItemType) =>
        handleCondominiumCommonAreaItemAction('view', row)
    const updateCondominiumCommonAreaItemHandler = (row: CondominiumCommonAreaItemType) =>
        handleCondominiumCommonAreaItemAction('edit', row)
    const deleteCondominiumCommonAreaItemHandler = (row: CondominiumCommonAreaItemType) =>
        handleCondominiumCommonAreaItemAction('delete', row)

    const router = useRouter()

    useEffect(() => {
        if (router.query.id) {
            dispatch(fetchData({ id: router.query.id as string }))
        }
    }, [dispatch, router.query.id])

    const handleFilter = useCallback((val: string) => {
        setSearchBoxValue(val)
    }, [])

    // ** Normalize the query values in the searchbox to lowercase for better filtering.
    const queryLowered = searchBoxValue.toLowerCase()

    // ** Loops through the Array of Residentials applying filters from the Searchbox.
    const filteredData = useMemo(() => {
        return store.commonAreaItems
            .filter(itemDeAreaComum => itemDeAreaComum.description.toLowerCase().includes(queryLowered))
            .sort((a, b) =>
                a.description.localeCompare(b.description, undefined, { numeric: true, sensitivity: 'base' })
            )
    }, [queryLowered, store.commonAreaItems])

    if (!store) {
        // Displays a spinner if the store is not yet populated with data.
        return <FallbackSpinner />
    }

    return (
        <Card sx={{ marginBottom: 6 }}>
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
                    placeholder='Buscar Item de Área Comum'
                    onChange={e => handleFilter(e.target.value)}
                />

                <Button sx={{ mb: 2 }} onClick={addCondominiumCommonAreaItemHandler} variant='contained'>
                    Adicionar Item de Área Comum
                </Button>
            </Box>
            <Divider sx={{ margin: 0 }} />

            <TableContainer>
                <Table size='small' sx={{ minWidth: 500 }}>
                    <TableHead
                        sx={{
                            backgroundColor: theme =>
                                theme.palette.mode === 'light' ? 'grey.50' : 'background.default'
                        }}
                    >
                        <TableRow>
                            <TableCell sx={{ height: '3.375rem' }}>Descrição</TableCell>
                            <TableCell sx={{ height: '3.375rem' }}>Quantidade</TableCell>
                            <TableCell
                                sx={{ height: '3.375rem', flex: 0.15, minWidth: 80, maxWidth: 80, textAlign: 'center' }}
                            >
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(filteredData.length > 0 &&
                            filteredData.map((item: CondominiumCommonAreaItemType) => (
                                <TableRow hover key={item.id} sx={{ '&:last-of-type td': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'left' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{item.quantity_of_items}</TableCell>
                                    <TableCell sx={{ height: '3.375rem', minWidth: 80, maxWidth: 80 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconButton onClick={() => viewCondominiumCommonAreaItemHandler(item)}>
                                                <EyeOutline fontSize='small' />
                                            </IconButton>
                                            <IconButton onClick={() => updateCondominiumCommonAreaItemHandler(item)}>
                                                <PencilOutline fontSize='small' />
                                            </IconButton>
                                            <IconButton onClick={() => deleteCondominiumCommonAreaItemHandler(item)}>
                                                <DeleteOutline fontSize='small' />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))) || (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    Esta Área Comum não possui Itens cadastrados ou não existem Itens com os parâmetros
                                    buscados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <CondominiumCommonAreaItemActionsDialog
                actionType={actionType}
                actionData={actionData}
                open={CondominiumCommonAreaItemActionsDialogOpen}
                toggle={toggleCondominiumCommonAreaItemActionsDialog}
            />
        </Card>
    )
}

export default CondominiumCommonAreaDetailTabItems
