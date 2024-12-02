import formatter from '@core/utils/formatter'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { useState } from 'react'

const currency = formatter('currency')
const competence = formatter('competence')

type CollectionRowProps = {
    collection: CollectionType
    onViewCollection: (collectionId: string) => void
    onDeleteCollection: (collectionId: string) => void
}
export default function CollectionRow({ collection, onViewCollection, onDeleteCollection }: CollectionRowProps) {
    const [showDetails, setShowDetails] = useState(false)

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
                    {collection.description}
                </TableCell>
                <TableCell>{competence(collection.competence)}</TableCell>
                <TableCell>{currency(collection.total_amount)}</TableCell>
                <TableCell>{collection.charge_created ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => onViewCollection(collection.id)}>
                            <EyeOutline fontSize='small' />
                        </IconButton>
                        <IconButton
                            onClick={() => onDeleteCollection(collection.id)}
                            disabled={collection.charge_created}
                        >
                            <DeleteOutline fontSize='small' />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>
            {showDetails &&
                collection.items.map(uhabCollection => (
                    <TableRow sx={{ height: '65px' }} key={uhabCollection.id}>
                        <TableCell>
                            <Box sx={{ paddingLeft: '54px' }}>{uhabCollection.uhab_name}</Box>
                        </TableCell>
                        <TableCell
                            style={{
                                maxWidth: '320px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                height: '65px'
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
                                {collection.description}
                            </span>
                            <span
                                style={{
                                    opacity: 0.5
                                }}
                            >
                                {collection.recurrence_index} de {collection.recurrence_value}
                            </span>
                        </TableCell>
                        <TableCell>{competence(collection.competence)}</TableCell>
                        <TableCell>{currency(uhabCollection.amount)}</TableCell>
                        <TableCell>{collection.charge_created ? 'Sim' : 'Não'}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
        </>
    )
}
