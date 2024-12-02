import TableCell from '@core/components/table/TableCell'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { selectCondominiumId } from 'src/store/apps/user'
import { useAppSelector } from 'src/store'
import { VehiclesService } from 'src/services/vehiclesService'
import QueryTable from '@core/components/table/QueryTable'
import { DataParams } from '@core/components/table/types'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const LinkStyle = styled('a')(({ theme }) => ({
    color: theme.palette.mode,
    textDecoration: 'underline',
    cursor: 'pointer'
}))

function VehicleReports() {
    const condominiumId = useAppSelector(selectCondominiumId)
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    return (
        <Box display='flex' gap={2}>
            <Card style={{ flexGrow: 1 }}>
                <CardContent>
                    <QueryTable
                        title='Relatório de Veículos'
                        showExport={true}
                        queryFn={(page: number, page_size: number) =>
                            VehiclesService.report_vehicle.get(
                                { fk_condominium: condominiumId },
                                { page: page + 1, page_size }
                            )
                        }
                        queryKey={['vehicle']}
                    >
                        {condominium?.has_grouping && (
                            <TableCell align='left' header='Agrupamento' field='uhab_grouping' />
                        )}
                        <TableCell align='left' header='Unidade' field='uhab_name'>
                            {({ row }: DataParams<any>) => (
                                <Link href={`/condominium/residentials/${row.uhab_id}`}>
                                    <LinkStyle>{row.uhab_name}</LinkStyle>
                                </Link>
                            )}
                        </TableCell>
                        <TableCell
                            align='left'
                            header='Placa'
                            field='vehicle_plate'
                            valueGetter={({ row }) => {
                                return row.vehicle_plate.replace(/(\w{3})(\w{4})/, '$1-$2')
                            }}
                        />
                        <TableCell align='left' header='Fabricante' field='vehicle_manufacturer' />
                        <TableCell align='left' header='Modelo' field='vehicle_model' />
                        <TableCell align='left' header='Cor' field='color' />
                    </QueryTable>
                </CardContent>
            </Card>
        </Box>
    )
}

export default VehicleReports
