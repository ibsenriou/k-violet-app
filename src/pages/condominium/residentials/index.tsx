import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from 'src/store'
import { fetchData, useFindResidentialGroupName } from 'src/store/apps/condominium/residentials'

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

import ResidentialActionsDialog from 'src/views/pages/condominium/residentials/list/ResidentialActionsDialog'

import { ResidentialType } from '@typesApiMapping/apps/condominium/residentialTypes'

import { LookupsService } from 'src/services/lookupsService'
import { usePermission } from 'src/context/PermissionContext'

interface CellType {
  row: ResidentialType
}

const ResidentialsList = () => {
  const permissions = usePermission()
  const dispatch = useAppDispatch()

  const [pageSize, setPageSize] = useState<number>(10)
  const [searchBoxValue, setSearchBoxValue] = useState<string>('')

  const residentials = useSelector((state: RootState) => state.residentials)
  const findResidentialGroupName = useFindResidentialGroupName()

  const [actionType, setActionType] = useState<'add' | 'edit' | 'delete'>('add')
  const [actionData, setActionData] = useState<ResidentialType | {}>({})
  const [residentialActionsDialogOpen, setResidentialActionsDialogOpen] = useState<boolean>(false)

  const toggleResidentialActionsDialog = () => setResidentialActionsDialogOpen(!residentialActionsDialogOpen)

  const handleResidentialAction = (type: 'add' | 'edit' | 'delete', row: ResidentialType | {} = {}) => {
    setActionType(type)
    setActionData(row)
    toggleResidentialActionsDialog()
  }

  const addResidentialHandler = () => handleResidentialAction('add')
  const updateResidentialHandler = (row: ResidentialType) => handleResidentialAction('edit', row)
  const deleteResidentialHandler = (row: ResidentialType) => handleResidentialAction('delete', row)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const handleFilter = useCallback((val: string) => {
    setSearchBoxValue(val)
  }, [])

  const queryLowered = searchBoxValue.toLowerCase()

  const { find: findResidentialType } = useService(LookupsService.lookup_type_of_residential)

  const filteredData = useMemo(() => {
    return residentials.residentials
      .filter(residential => residential.name.toLowerCase().includes(queryLowered))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
  }, [queryLowered, residentials.residentials])


  const columns: GridColumns = [
    {
      flex: 0.25,
      minWidth: 200,
      disableColumnMenu: true,
      sortable: false,
      field: 'name',
      headerName: 'Residencial',
      renderCell: ({ row }: CellType) => {
        const { id, name } = row
        const canRead = permissions.can('condominium.residential:retrieve', { residentialId: row.id })

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              {canRead ? (
                <Link href={`residentials/${id}`} passHref>
                  <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                  >
                    {name}
                  </Typography>
                </Link>
              ) : (
                <Typography noWrap variant='body2' sx={{ fontWeight: canRead ? 600 : 400, color: 'text.primary' }}>
                  {name}
                </Typography>
              )}
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
      field: 'fk_lookup_type_of_residential',
      headerName: 'Tipo de Residencial',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {findResidentialType(row.fk_lookup_type_of_residential)?.description}
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
            {findResidentialGroupName(row.id)}
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
      align: 'center',

      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {permissions.can('condominium.residential:retrieve', { residentialId: row.id }) && (
            <IconButton>
              <Link href={`residentials/${row.id}`} passHref>
                <EyeOutline fontSize='small' />
              </Link>
            </IconButton>
          )}
          {permissions.can('condominium.residential:update') && (
            <IconButton onClick={() => updateResidentialHandler(row)}>
              <PencilOutline fontSize='small' />
            </IconButton>
          )}
          {permissions.can('condominium.residential:delete') && (
            <IconButton onClick={() => deleteResidentialHandler(row)}>
              <DeleteOutline fontSize='small' />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  if (!residentials) {
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
              placeholder='Buscar Residencial'
              onChange={e => handleFilter(e.target.value)}
            />
            {permissions.can('condominium.residential:create') && (
              <Button sx={{ mb: 2 }} onClick={addResidentialHandler} variant='contained'>
                Adicionar Residencial
              </Button>
            )}
          </Box>
          <DataGrid
            componentsProps={{
              pagination: {
                labelRowsPerPage: 'Linhas por página'
              }
            }}
            localeText={{ noRowsLabel: 'Nenhum residencial encontrado!' }}
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

      <ResidentialActionsDialog
        actionType={actionType}
        actionData={actionData}
        open={residentialActionsDialogOpen}
        toggle={toggleResidentialActionsDialog}
      />
    </Grid>
  )
}

export default ResidentialsList
