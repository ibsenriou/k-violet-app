import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from 'src/store'
import { fetchData, useFindCommercialGroupName } from 'src/store/apps/condominium/commercials'

import FallbackSpinner from '@core/components/spinner'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColumns } from '@mui/x-data-grid'

import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'

import Link from 'next/link'

import useService from 'src/hooks/useService'

import CommercialActionsDialog from 'src/views/pages/condominium/commercials/list/CommercialActionsDialog'

import { CommercialType } from '@typesApiMapping/apps/condominium/commercialTypes'

import { usePermission } from 'src/context/PermissionContext'
import { LookupsService } from 'src/services/lookupsService'

interface CellType {
  row: CommercialType
}

const CommercialsList = () => {
  const permissions = usePermission()
  const dispatch = useAppDispatch()

  const [pageSize, setPageSize] = useState<number>(10)
  const [searchBoxValue, setSearchBoxValue] = useState<string>('')

  const commercials = useSelector((state: RootState) => state.commercials)
  const findCommercialGroupName = useFindCommercialGroupName()

  const [actionType, setActionType] = useState<'add' | 'edit' | 'delete'>('add')
  const [actionData, setActionData] = useState<CommercialType | {}>({})
  const [commercialActionsDialogOpen, setCommercialActionsDialogOpen] = useState<boolean>(false)

  const toggleCommercialActionsDialog = () => setCommercialActionsDialogOpen(!commercialActionsDialogOpen)

  const handleCommercialAction = (type: 'add' | 'edit' | 'delete', row: CommercialType | {} = {}) => {
    setActionType(type)
    setActionData(row)
    toggleCommercialActionsDialog()
  }

  const addCommercialHandler = () => handleCommercialAction('add')
  const updateCommercialHandler = (row: CommercialType) => handleCommercialAction('edit', row)
  const deleteCommercialHandler = (row: CommercialType) => handleCommercialAction('delete', row)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const handleFilter = useCallback((val: string) => {
    setSearchBoxValue(val)
  }, [])

  const queryLowered = searchBoxValue.toLowerCase()

  const { find: findCommercialType } = useService(LookupsService.lookup_type_of_commercial)

  const filteredData = useMemo(() => {
    return commercials.commercials
      .filter(commercial => commercial.name.toLowerCase().includes(queryLowered))
  }, [queryLowered, commercials.commercials])


  const columns: GridColumns = [
    {
      flex: 0.25,
      minWidth: 200,
      disableColumnMenu: true,
      sortable: false,
      field: 'name',
      headerName: 'Comercial',
      renderCell: ({ row }: CellType) => {
        const { id, name } = row
        const canRead = permissions.can('condominium.commercial:retrieve', { commercialId: row.id })

        return (

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              {
                canRead ?
                  <Link href={`commercials/${id}`} passHref>
                    <Typography
                      noWrap
                      component='a'
                      variant='body2'
                      sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                    >
                      {name}
                    </Typography>
                  </Link>
                  :
                  <Typography
                    noWrap
                    variant='body2'
                    sx={{ fontWeight: 600, color: 'text.primary' }}
                  >
                    {name}
                  </Typography>
              }
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 150,
      disableColumnMenu: true,
      sortable: false,
      field: 'fk_lookup_type_of_commercial',
      headerName: 'Tipo de Comercial',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {findCommercialType(row.fk_lookup_type_of_commercial)?.description}
          </Typography>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 150,
      disableColumnMenu: true,
      sortable: false,
      field: 'fk_uhab',
      headerName: 'Agrupamento',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {findCommercialGroupName(row.id)}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 135,
      maxWidth: 135,
      disableColumnMenu: true,
      sortable: false,
      field: 'actions',
      headerName: 'Ações',
      headerAlign: 'center',

      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {
            permissions.can('condominium.commercial:retrieve', { commercialId: row.id }) &&
            <IconButton>
              <Link href={`commercials/${row.id}`} passHref>
                <EyeOutline fontSize='small' />
              </Link>
            </IconButton>
          }
          {
            permissions.can('condominium.commercial:update', { commercialId: row.id }) &&
            <IconButton onClick={() => updateCommercialHandler(row)}>
              <PencilOutline fontSize='small' />
            </IconButton>
          }
          {
            permissions.can('condominium.commercial:delete', { commercialId: row.id }) &&
            <IconButton onClick={() => deleteCommercialHandler(row)}>
              <DeleteOutline fontSize='small' />
            </IconButton>
          }
        </Box>
      )
    }
  ]

  if (!commercials) {
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
              placeholder='Buscar Comercial'
              onChange={e => handleFilter(e.target.value)}
            />
            {permissions.can('condominium.commercial:create') && (
              <Button sx={{ mb: 2 }} onClick={addCommercialHandler} variant='contained'>
                Adicionar Comercial
              </Button>
            )}
          </Box>
          <DataGrid
            componentsProps={{
              pagination: {
                labelRowsPerPage: 'Linhas por página'
              }
            }}
            localeText={{ noRowsLabel: 'Nenhum comercial encontrado!' }}
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

      <CommercialActionsDialog
        actionType={actionType}
        actionData={actionData}
        open={commercialActionsDialogOpen}
        toggle={toggleCommercialActionsDialog}
      />
    </Grid>
  )
}

export default CommercialsList
