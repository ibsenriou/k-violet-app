import TableCell from '@core/components/table/TableCell'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { selectCondominiumId } from 'src/store/apps/user'
import { useAppSelector } from 'src/store'
import { PetsService } from 'src/services/petsService'
import { DataParams } from '@core/components/table/types'
import QueryTable from '@core/components/table/QueryTable'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const LinkStyle = styled('a')(({ theme }) => ({
    color: theme.palette.mode,
    textDecoration: 'underline',
    cursor: 'pointer'
}))

function PetsReport() {
    const condominiumId = useAppSelector(selectCondominiumId)
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    return (
        <Box display='flex' gap={2}>
            <Card style={{ flexGrow: 1 }}>
                <CardContent>
                    <QueryTable
                        title='Relatório de Pets'
                        showExport={true}
                        queryFn={(page: number, page_size: number) =>
                            PetsService.report_pet.get({ fk_condominium: condominiumId }, { page: page + 1, page_size })
                        }
                        queryKey={['pet']}
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
                        <TableCell align='left' header='Nome' field='name' />
                        <TableCell align='left' header='Espécie' field='animal_species' />
                        <TableCell align='left' header='Raça' field='animal_breed' />
                        <TableCell align='left' header='Porte' field='animal_size' />
                        <TableCell align='left' header='Cor' field='animal_color' />
                    </QueryTable>
                </CardContent>
            </Card>
        </Box>
    )
}

export default PetsReport
