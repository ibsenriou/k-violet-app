import TableCell from '@core/components/table/TableCell'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { selectCondominiumId } from 'src/store/apps/user'
import { useAppSelector } from 'src/store'
import { CondominiumService } from 'src/services/condominiumService'
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

function GarageReport() {
    const condominiumId = useAppSelector(selectCondominiumId)
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    return (
        <Box display='flex' gap={2}>
            <Card style={{ flexGrow: 1 }}>
                <CardContent>
                    <QueryTable
                        title='Relatório de Garagens'
                        showExport={true}
                        queryFn={(page: number, page_size: number) =>
                            CondominiumService.report_garage.get(
                                { fk_condominium: condominiumId },
                                { page: page + 1, page_size }
                            )
                        }
                        queryKey={['garage_report']}
                    >
                        {condominium?.has_grouping && (
                            <TableCell align='left' header='Agrupamento' field='uhab_grouping' />
                        )}
                        <TableCell align='left' header='Unidade' field='uhab_name'>
                            {({ row }: DataParams<any>) =>
                                row.uhab_type == 'RESIDENTIAL' ? (
                                    <Link href={`/condominium/residentials/${row.uhab_id}`}>
                                        <LinkStyle>{row.uhab_name}</LinkStyle>
                                    </Link>
                                ) : (
                                    <Link href={`/condominium/commercials/${row.uhab_id}`}>
                                        <LinkStyle>{row.uhab_name}</LinkStyle>
                                    </Link>
                                )
                            }
                        </TableCell>
                        <TableCell align='left' header='Nome' field='name' />
                        <TableCell align='left' header='Vagas' field='number_of_spots' />
                        <TableCell
                            align='left'
                            header='Em uso'
                            field='is_garage_being_used'
                            valueGetter={({ row }) => {
                                return row.is_garage_being_used ? 'Sim' : 'Não'
                            }}
                        />
                        <TableCell
                            align='left'
                            header='Locação'
                            field='is_garage_available_for_rent'
                            valueGetter={({ row }) => {
                                return row.is_garage_available_for_rent ? 'Sim' : 'Não'
                            }}
                        />
                        <TableCell
                            align='left'
                            header='Gaveta'
                            field='is_drawer_type_garage'
                            valueGetter={({ row }) => {
                                return row.is_drawer_type_garage ? 'Sim' : 'Não'
                            }}
                        />
                        <TableCell
                            align='left'
                            header='Coberta'
                            field='is_covered_type_garage'
                            valueGetter={({ row }) => {
                                return row.is_covered_type_garage ? 'Sim' : 'Não'
                            }}
                        />
                    </QueryTable>
                </CardContent>
            </Card>
        </Box>
    )
}

export default GarageReport
