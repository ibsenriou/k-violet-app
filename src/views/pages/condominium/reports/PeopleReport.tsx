import TableCell from '@core/components/table/TableCell'
import { addCNPJMask, addCPFMask } from '@core/utils/validate-national_individual_taxpayer_identification'
import Link from 'next/link'
import { PeopleService } from 'src/services/peopleService'
import { styled } from '@mui/material/styles'
import { selectCondominiumId } from 'src/store/apps/user'
import { useAppSelector } from 'src/store'
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

type PeopleReportProps = {
    type: string
}
function PeopleReport({ type }: PeopleReportProps) {
    const condominiumId = useAppSelector(selectCondominiumId)
    const condominium = useAppSelector(state => state.aboutTheCondominium.data.condominium)

    const title =
        type === 'Proprietary'
            ? 'Relatório de Proprietários'
            : type === 'Employee'
            ? 'Relatório de Funcionários'
            : 'Relatório de Moradores'

    return (
        <Box display='flex' gap={2}>
            <Card style={{ flexGrow: 1 }}>
                <CardContent>
                    <QueryTable
                        title={title}
                        showExport={true}
                        queryKey={['people_report']}
                        queryFn={(page, pageSize) =>
                            PeopleService.report.get(
                                { type, fk_condominium: condominiumId },
                                { page: page + 1, page_size: pageSize }
                            )
                        }
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
                        <TableCell
                            align='left'
                            header='CPF/CNPJ'
                            field='national_identification'
                            width={180}
                            valueGetter={({ row }) => {
                                return row.national_individual_taxpayer_identification
                                    ? addCPFMask(row.national_individual_taxpayer_identification)
                                    : addCNPJMask(row.national_corporate_taxpayer_identification_number)
                            }}
                        />
                        {type === 'Resident' && (
                            <TableCell
                                align='left'
                                header='Responsável'
                                field='is_this_the_main_role'
                                width={80}
                                valueGetter={({ row }) => (row.is_this_the_main_role ? 'Sim' : 'Não')}
                            />
                        )}

                        <TableCell
                            align='left'
                            header='E-mail'
                            field='person_contact_information_set-email'
                            minWidth={180}
                            valueGetter={({ row }) =>
                                row.person_contact_information_set
                                    ?.filter((contact: any) => contact._type_of_contact_information === 'E-mail')
                                    .map((contact: any) => contact.description)
                            }
                        />

                        <TableCell
                            align='left'
                            header='Telefone'
                            field='person_contact_information_set-phone'
                            width={180}
                            valueGetter={({ row }) =>
                                row.person_contact_information_set
                                    ?.filter(
                                        (contact: any) => contact._type_of_contact_information === 'Telefone Celular'
                                    )
                                    .map((contact: any) => contact.description)
                            }
                        />

                        {type === 'Resident' && (
                            <TableCell
                                align='left'
                                header='Responsável'
                                field='is_this_the_main_role'
                                width={80}
                                valueGetter={({ row }) => (row.is_this_the_main_role ? 'Sim' : 'Não')}
                            />
                        )}

                        <TableCell
                            align='left'
                            header='E-mail'
                            field='person_contact_information_set-email'
                            minWidth={180}
                            valueGetter={({ row }) =>
                                row.person_contact_information_set
                                    ?.filter((contact: any) => contact._type_of_contact_information === 'E-mail')
                                    .map((contact: any) => contact.description)
                            }
                        />

                        <TableCell
                            align='left'
                            header='Telefone'
                            field='person_contact_information_set-phone'
                            width={180}
                            valueGetter={({ row }) =>
                                row.person_contact_information_set
                                    ?.filter(
                                        (contact: any) => contact._type_of_contact_information === 'Telefone Celular'
                                    )
                                    .map((contact: any) => contact.description)
                            }
                        />
                    </QueryTable>
                </CardContent>
            </Card>
        </Box>
    )
}

export default PeopleReport
