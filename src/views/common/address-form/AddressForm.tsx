import PostalCodeInput from '@core/components/inputs/PostalCodeInput'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TextField from '@core/components/inputs/TextField'
import SelectField from '@core/components/inputs/SelectField'
import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import useAddressForm from './useAddressForm'
import ConfirmationDialog from '@core/components/confirmation-dialog'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

const schema = yup.object().shape({
    number: yup.string().required('Este campo é obrigatório!'),
    postal_code_number: yup
        .string()
        .required('Este campo é obrigatório!')
        .transform(value => value.replace(/[^\d]/g, ''))
        .length(8, 'Este campo deve ter 8 dígitos!'),
    complement: yup.string().notRequired(),
    street_name: yup.string().required('Este campo é obrigatório!'),
    fk_district: yup.string().required('Este campo é obrigatório!')
})

type AddressFormProps = {
    canEdit: boolean
    address: AddressType | null
    onChange: (data: {
        street_name?: string
        number?: string
        complement?: string
        fk_postal_code?: string
        fk_state?: string
        fk_city?: string
        fk_district?: string
    }) => Promise<void>
}
function AddressForm({ address, onChange, canEdit }: AddressFormProps) {
    const {
        control,
        formState: { errors },
        watch,
        reset,
        handleSubmit
    } = useForm({
        defaultValues: {
            number: address?.number || '',
            postal_code_number: undefined,
            complement: address?.complement || '',
            street_name: address?.street_name || '',
            fk_district: address?.fk_district || ''
        },
        resolver: yupResolver(schema)
    })

    const {
        searchPostalCode,
        cityQuery,
        districtQuery,
        postalCodeQuery,
        stateQuery,
        handleSave,
        formDisabled,
        editAddress,
        cancelEdit
    } = useAddressForm({
        postal_code_number: watch('postal_code_number'),
        address,
        reset,
        onChange
    })

    const isPostalCodeDirty = watch('postal_code_number') !== postalCodeQuery.data?.postal_code_number

    return (
        <CardContent>
            <Grid container spacing={7}>
                <Grid item sm={12} xs={12}>
                    <PostalCodeInput
                        control={control}
                        loading={postalCodeQuery.isLoading}
                        disabled={formDisabled || postalCodeQuery.isLoading}
                        onBlur={searchPostalCode}
                        error={errors.postal_code_number}
                        name='postal_code_number'
                        label='CEP'
                    />
                </Grid>

                <Grid item sm={4} xs={12}>
                    <TextField value={stateQuery.data?.state_name} label='Estado' name='state_name' disabled={true} />
                </Grid>

                <Grid item sm={8} xs={12}>
                    <TextField value={cityQuery.data?.city_name} label='Cidade' name='city_name' disabled={true} />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <SelectField
                        control={control}
                        name='fk_district'
                        items={districtQuery.data || []}
                        label='Bairro'
                        disabled={postalCodeQuery.data?.fk_district !== null || formDisabled}
                        keyLabel='district_name'
                        keyValue='id'
                        error={errors.fk_district}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField
                        control={control}
                        label='Logradouro'
                        name='street_name'
                        disabled={formDisabled || postalCodeQuery.data?.street_name !== null}
                        error={errors.street_name}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField
                        control={control}
                        label='Número'
                        name='number'
                        disabled={formDisabled}
                        error={errors.number}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField
                        control={control}
                        label='Complemento'
                        name='complement'
                        disabled={formDisabled}
                        error={errors.complement}
                    />
                </Grid>

                {!formDisabled && (
                    <Grid item xs={12}>
                        <ConfirmationDialog
                            title='Atualizar Endereço'
                            subTitle='Altere seu endereço.'
                            content='Esta ação irá alterar as informações de endereço e poderá influenciar em documentações em diversos módulos do sistema!'
                            onConfirm={handleSave}
                            render={confirm => (
                                <Button
                                    variant='contained'
                                    sx={{ marginRight: 3.5 }}
                                    type='submit'
                                    onClick={handleSubmit(confirm)}
                                    disabled={
                                        postalCodeQuery.isLoading || Object.keys(errors).length > 0 || isPostalCodeDirty
                                    }
                                >
                                    Salvar Alterações
                                </Button>
                            )}
                        />
                        <Button variant='contained' color='error' onClick={() => cancelEdit?.()}>
                            Cancelar
                        </Button>
                    </Grid>
                )}
                {formDisabled && canEdit && (
                    <Grid item xs={12}>
                        <Button
                            variant='contained'
                            color='primary'
                            sx={{ marginRight: 3.5 }}
                            type='submit'
                            onClick={() => {
                                editAddress()
                            }}
                        >
                            Habilitar Edição
                        </Button>
                    </Grid>
                )}
            </Grid>
        </CardContent>
    )
}

export default AddressForm
