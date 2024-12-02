import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import type { Theme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { CollectionType } from '@typesApiMapping/apps/financial/collectionTypes'
import { CollectionFormat } from '../../enums'

type InfoDataDetailsProps = {
    collection: CollectionType
}
export default function InfoDataDetails({ collection }: InfoDataDetailsProps) {
    return (
        <Box display='grid' gap='16px'>
            <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='16px'>
                <TextField
                    label='Categoria'
                    value={collection.account_description
                        .replace('Despesas C/ Materiais de', '')
                        .replace('Despesas C/ Materiais', '')
                        .replace('Despesas C/', '')
                        .trim()}
                    disabled
                />
                <TextField label='Competência' value={collection.competence} disabled />
                <TextField
                    label='Responsável'
                    name='responsible'
                    disabled
                    value={collection.responsible == 'resident' ? 'Morador/Locatário' : 'Proprietário'}
                    helperText={
                        collection.responsible == 'resident'
                            ? 'Caso o morador/locatário não esteja cadastrado, será gerado a cobrança para o proprietário.'
                            : ''
                    }
                />

                <TextField
                    label='Natureza'
                    name='nature'
                    disabled
                    value={collection.nature == 'ordinary' ? 'Ordinária' : 'Extraordinária'}
                />
                <TextField
                    value={collection.amount / 100}
                    label='Valor'
                    type='number'
                    disabled
                    InputProps={{
                        startAdornment: (
                            <Typography
                                variant='body1'
                                paddingRight='4px'
                                sx={(theme: Theme) => ({
                                    color: theme.palette.text.secondary
                                })}
                            >
                                R$
                            </Typography>
                        )
                    }}
                />
                <TextField
                    label='Tipo'
                    name='type'
                    disabled
                    value={collection.type == 'fractional' ? 'Por rateio' : 'Por taxa fixa'}
                />
            </Box>
            <Box display='grid' gap='16px'>
                <TextField disabled label='Descrição' fullWidth multiline minRows={3} />
                <FormGroup>
                    <FormLabel id='demo-form-control-label-placement' disabled>
                        Formato da cobrança
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby='demo-controlled-radio-buttons-group'
                        name='controlled-radio-buttons-group'
                        row
                    >
                        <FormControlLabel
                            checked={collection.format == CollectionFormat.single}
                            control={<Radio />}
                            label='Única'
                            disabled
                        />
                        <FormControlLabel
                            checked={collection.format == CollectionFormat.recurrent}
                            control={<Radio />}
                            label='Recorrente'
                            disabled
                        />
                        <FormControlLabel
                            checked={collection.format == CollectionFormat.installments}
                            control={<Radio />}
                            label='Parcelado'
                            disabled
                        />
                    </RadioGroup>
                </FormGroup>
            </Box>
        </Box>
    )
}
