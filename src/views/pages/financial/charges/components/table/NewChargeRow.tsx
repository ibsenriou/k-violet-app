import formatter from '@core/utils/formatter'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import { useState } from 'react'
import { CollectionFormat } from '../../../collection/enums'
import { NewChargeCollection } from '@typesApiMapping/apps/financial/chargeTypes'

const currency = formatter('currency')

type CollectionRowProps = {
    collection: NewChargeCollection
}
export default function NewChargeRow({ collection }: CollectionRowProps) {
    const [showDetails, setShowDetails] = useState(false)

    function renderResponsible(responsible: string, role: string) {
        if (role == 'Proprietary') {
            return 'Proprietário - ' + (responsible || 'Não cadastrado')
        }
        if (role == 'Resident') {
            return 'Morador - ' + (responsible || 'Não cadastrado - Cobrança direcionada ao proprietário')
        }
        if (role == 'Renter') {
            return 'Locatário - ' + (responsible || 'Não cadastrado - Cobrança direcionada ao proprietário')
        }
    }

    return (
        <>
            <TableRow key={collection.id}>
                <TableCell padding={'none'}>
                    <IconButton onClick={() => setShowDetails(s => !s)}>
                        <ChevronRight
                            sx={{
                                transform: showDetails ? 'rotate(90deg)' : 'rotate(0)',
                                transition: 'transform 0.3s'
                            }}
                        />
                    </IconButton>
                </TableCell>
                <TableCell
                    style={{
                        maxWidth: '320px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {collection.name}
                </TableCell>
                <TableCell>
                    {renderResponsible(collection.responsible_name, collection.type_of_uhab_user_role)}
                </TableCell>
                <TableCell>{currency(collection.total_amount)}</TableCell>
            </TableRow>
            {showDetails &&
                collection.items.map(uhabCollection => (
                    <TableRow sx={{ height: '65px' }} key={uhabCollection.id}>
                        <TableCell
                            colSpan={3}
                            style={{
                                minWidth: '50%',
                                paddingLeft: '100px'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    display: 'grid',
                                    alignItems: 'center'
                                }}
                            >
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'block'
                                    }}
                                >
                                    {uhabCollection.collection_description}
                                </span>
                                {uhabCollection.format == CollectionFormat.installments && (
                                    <span
                                        style={{
                                            opacity: 0.5
                                        }}
                                    >
                                        {uhabCollection.recurrence_index} de {uhabCollection.recurrence_value}
                                    </span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{currency(uhabCollection.amount)}</TableCell>
                    </TableRow>
                ))}
        </>
    )
}
