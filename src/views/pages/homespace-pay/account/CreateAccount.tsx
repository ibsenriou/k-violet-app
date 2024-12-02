import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

import { FormProvider, useForm } from 'react-hook-form'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CardActions from '@mui/material/CardActions'
import LoadingButton from '@core/components/loading-button'
import { useMutation } from '@tanstack/react-query'
import { HomespacePayService } from 'src/services/homespacePayService'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import CreateAccountForm from './CreateAccountForm'

type CreateAccountViewProps = {
    onCreateAccount: () => void
}
export default function CreateAccountView({ onCreateAccount }: CreateAccountViewProps) {
    const formProps = useForm()

    const condominium = useSelector((state: RootState) => state.aboutTheCondominium.data.condominium)
    const address = useSelector((state: RootState) => state.aboutTheCondominium.data.address)
    const contactInformation = useSelector((state: RootState) => state.aboutTheCondominium.data.contactInformation)
    const typeOfContactInformation = useSelector(
        (state: RootState) => state.aboutTheCondominium.data.typeOfContactInformation
    )

    const emailLookup = typeOfContactInformation?.find(c => c.description === 'E-mail')
    const phoneLookup = typeOfContactInformation?.find(c => c.description === 'Telefone Comercial')
    const cellphoneLookup = typeOfContactInformation?.find(c => c.description === 'Telefone Celular')

    const email = contactInformation?.find(
        c => c.fk_lookup_type_of_contact_information === emailLookup?.id
    )?.description
    const phone = contactInformation?.find(
        c => c.fk_lookup_type_of_contact_information === phoneLookup?.id
    )?.description
    const cellphone = contactInformation?.find(
        c => c.fk_lookup_type_of_contact_information === cellphoneLookup?.id
    )?.description

    const createAccountMutation = useMutation({
        onMutate: async (data: any) => {
            return HomespacePayService.account.post(null, {
                ...data,
                phone: data.phone || phone,
                email: data.email || email,
                mobile_phone: data.mobile_phone || cellphone,
                name: condominium.name,
                national_corporate_taxpayer_identification_number:
                    condominium.national_corporate_taxpayer_identification_number
            })
        },
        onSuccess: () => {
            onCreateAccount()
        }
    })

    if (!condominium || !address) {
        return null
    }

    return (
        <Card>
            <CardHeader title='Criação de conta' />
            <CardContent>
                <Box display='grid' gap='1rem'>
                    <Alert icon={false} severity='warning' sx={{ marginBottom: 4 }}>
                        <AlertTitle>Criação de conta Homespace Pay</AlertTitle>
                        <p>
                            A criação de conta Homespace Pay é um processo que envolve a criação de uma conta de
                            pagamento para geração de boletos e pagamentos de taxas condominiais.
                        </p>
                    </Alert>
                    <FormProvider {...formProps}>
                        <CreateAccountForm
                            address={address}
                            condominium={condominium}
                            email={email}
                            phone={phone}
                            cellphone={cellphone}
                        />
                    </FormProvider>
                </Box>
            </CardContent>
            <CardActions>
                <LoadingButton
                    variant='contained'
                    loading={createAccountMutation.isPending}
                    style={{ marginLeft: 'auto' }}
                    onClick={formProps.handleSubmit(data => createAccountMutation.mutate(data))}
                >
                    Criar conta
                </LoadingButton>
            </CardActions>
        </Card>
    )
}
