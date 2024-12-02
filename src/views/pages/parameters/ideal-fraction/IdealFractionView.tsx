import Table from '@core/components/table/Table'
import TableCell from '@core/components/table/TableCell'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CondominiumService } from 'src/services/condominiumService'
import NewIdealFractionDialog from './NewIdealFractionDialog'
import { useState } from 'react'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import { DataParams } from '@core/components/table/types'
import { DistributionType, IdealFractionType } from '@typesApiMapping/apps/condominium/idealFractionTypes'
import ConfirmationDialog from '@core/components/confirmation-dialog'
import useSnackbar from 'src/hooks/useSnackbar'

export default function IdealFractionView() {
    const [openNewIdealFractionDialog, setOpenNewIdealFractionDialog] = useState(false)

    const { error } = useSnackbar()
    const queryClient = useQueryClient()

    const fractionQuery = useQuery({
        queryKey: ['IdealFraction'],
        queryFn: () => CondominiumService.ideal_fraction.get().then(response => response.data),
        select: data => data.results
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CondominiumService.ideal_fraction_by_id.delete({ idealFractionId: id }),
        onSuccess: (_, idealFractionId: string) => {
            queryClient.setQueryData(['IdealFraction'], (data: { results: IdealFractionType[] }) => {
                data.results = data.results.filter(idealFraction => idealFraction.id !== idealFractionId)
                return data
            })
        },
        onError: () => {
            error('Erro ao excluir fração ideal. Tente novamente mais tarde.')
        }
    })

    const copyMutation = useMutation<IdealFractionType, unknown, IdealFractionType>({
        mutationFn: async (data: IdealFractionType) => {
            const response = await CondominiumService.ideal_fraction_by_id_copy.post(
                { idealFractionId: data.id },
                { data }
            )
            return response.data
        },
        onSuccess: (createdIdealFraction: IdealFractionType) => {
            queryClient.setQueryData(['IdealFraction'], (data: { results: IdealFractionType[] }) => {
                data.results.push(createdIdealFraction)
                return data
            })
        },
        onError: () => {
            error('Erro ao copiar fração ideal. Tente novamente mais tarde.')
        }
    })

    return (
        <Card>
            <Table
                title='Fração Ideal'
                data={fractionQuery.data || []}
                topRightActionCallback={() => setOpenNewIdealFractionDialog(true)}
                topRightActionLabel='Adicionar Fração Ideal'
                searchField={'description'}
            >
                <TableCell header='Nome' field='description' />
                <TableCell header='Principal' field='is_main' valueGetter={params => (params.value ? 'Sim' : 'Não')} />
                <TableCell
                    header='Tipo de Distribuição'
                    field='distribution_type'
                    width={250}
                    valueGetter={params => {
                        switch (params.value) {
                            case DistributionType.EQUAL_DISTRIBUTION_PER_UNIT:
                                return 'Distribuição Igual por Unidade'
                            case DistributionType.MANUAL_DISTRIBUTION:
                                return 'Distribuição Manual'
                        }
                    }}
                />
                <TableCell header='Ativo' field='activated_at' valueGetter={params => (params.value ? 'Sim' : 'Não')} />
                <TableCell header='Ações' field='actions' width={135}>
                    {({ row }: DataParams<IdealFractionType>) => (
                        <>
                            <IconButton>
                                <Link href={`/parameters/ideal-fraction/${row.id}`}>
                                    <EyeOutline />
                                </Link>
                            </IconButton>
                            <Tooltip title='Copiar Fração Ideal'>
                                <span>
                                    <ConfirmationDialog
                                        title='Copiar Fração Ideal'
                                        subTitle='Copiar essa fração ideal.'
                                        content='Deseja realmente copiar essa fração ideal?'
                                        onConfirm={() => copyMutation.mutateAsync(row)}
                                        render={confirm => (
                                            <IconButton onClick={() => confirm(row.id)}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        )}
                                        confirmLabel='Copiar'
                                    />
                                </span>
                            </Tooltip>
                            <ConfirmationDialog
                                title='Excluir Fração Ideal'
                                subTitle='Excluir essa fração ideal.'
                                content='Deseja realmente excluir a fração ideal?'
                                onConfirm={deleteMutation.mutateAsync}
                                render={confirm =>
                                    row.is_main ? (
                                        <Tooltip title='Não é possível excluir a fração ideal principal'>
                                            <span>
                                                <IconButton disabled={row.is_main} onClick={() => confirm(row.id)}>
                                                    <DeleteOutline />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <IconButton onClick={() => confirm(row.id)}>
                                            <DeleteOutline />
                                        </IconButton>
                                    )
                                }
                                confirmLabel='Excluir'
                            />
                        </>
                    )}
                </TableCell>
            </Table>
            <NewIdealFractionDialog
                key={'new-ideal-fraction-dialog-' + openNewIdealFractionDialog}
                open={openNewIdealFractionDialog}
                onClose={() => setOpenNewIdealFractionDialog(false)}
            />
        </Card>
    )
}
