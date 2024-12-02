import PostalCodeInput from '@core/components/inputs/PostalCodeInput'
import SelectField from '@core/components/inputs/SelectField'
import TextField from '@core/components/inputs/TextField'
import Grid from '@mui/material/Grid'
import { CondominiumType } from '@typesApiMapping/apps/condominium/condominiumTypes'
import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import useAddressForm from 'src/views/common/address-form/useAddressForm'

type CreateAccountFormProps = {
    address: AddressType
    condominium: CondominiumType
    phone?: string
    email?: string
    cellphone?: string
}
export default function CreateAccountForm({ address, condominium, phone, email, cellphone }: CreateAccountFormProps) {
    const {
        control,
        formState: { errors },
        watch,
        reset,
        setValue
    } = useFormContext()

    const { searchPostalCode, cityQuery, districtQuery, postalCodeQuery, stateQuery } = useAddressForm({
        postal_code_number: watch('postal_code_number'),
        reset,
        address: address
    })

    useEffect(() => setValue('phone', phone), [phone, setValue])
    useEffect(() => setValue('email', email), [email, setValue])
    useEffect(() => setValue('mobile_phone', cellphone), [cellphone, setValue])

    return (
        <Grid container spacing={7}>
            <Grid item sm={12} xs={12}>
                <TextField label='Nome' name='name' value={condominium.name} disabled />
            </Grid>
            <Grid item sm={6} xs={6}>
                <ReactInputMask
                    mask='99.999.999/9999-99'
                    value={condominium.national_corporate_taxpayer_identification_number}
                    disabled
                >
                    {() => (
                        <TextField
                            value={condominium.national_corporate_taxpayer_identification_number}
                            label='CNPJ'
                            placeholder='XXX.XXX/0001-XX'
                            disabled
                        />
                    )}
                </ReactInputMask>
            </Grid>
            <Grid item sm={6} xs={6}>
                <TextField control={control} label='E-mail' name='email' />
            </Grid>
            <Grid item sm={6} xs={6}>
                <TextField control={control} label='Telefone' name='phone' />
            </Grid>
            <Grid item sm={6} xs={6}>
                <TextField control={control} label='Celular' name='mobile_phone' />
            </Grid>
            <Grid item sm={8} xs={6}>
                <TextField
                    control={control}
                    label='Qual a média mensal que o condominio arrecada em cobranças?'
                    name='income_value'
                    startAdornment='R$'
                />
            </Grid>
            <Grid item sm={12} xs={12}>
                <PostalCodeInput
                    control={control}
                    loading={postalCodeQuery.isLoading}
                    disabled={postalCodeQuery.isLoading}
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
                {postalCodeQuery.data?.fk_district ? (
                    <TextField
                        value={districtQuery.data?.[0]?.district_name}
                        label='Bairro'
                        name='district_name'
                        disabled
                    />
                ) : (
                    <SelectField
                        control={control}
                        name='fk_district'
                        items={districtQuery.data || []}
                        label='Bairro'
                        disabled={postalCodeQuery.data?.fk_district !== null}
                        keyLabel='district_name'
                        keyValue='id'
                        error={errors.fk_district}
                    />
                )}
            </Grid>

            <Grid item sm={6} xs={12}>
                <TextField
                    control={control}
                    label='Logradouro'
                    name='street_name'
                    disabled={postalCodeQuery.data?.street_name !== null}
                    error={errors.street_name}
                />
            </Grid>

            <Grid item sm={6} xs={12}>
                <TextField control={control} label='Número' name='number' error={errors.number} />
            </Grid>

            <Grid item sm={6} xs={12}>
                <TextField control={control} label='Complemento' name='complement' error={errors.complement} />
            </Grid>
        </Grid>
    )
}
