import { forwardRef, ReactElement, Ref, useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { useSelector } from 'react-redux'

import { RootState, useAppDispatch } from 'src/store'
import { patchDataAboutTheCondominiumInfo } from 'src/store/apps/condominium/about-the-condominium'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import SnackbarAlert from '@core/components/snackbar-alert/SnackbarAlert'

import { CondominiumType } from '@typesApiMapping/apps/condominium/condominiumTypes'

import ConfirmationDialog from '@core/components/confirmation-dialog'
import { addCNPJMask } from '@core/utils/validate-national_individual_taxpayer_identification'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Box from '@mui/material/Box'

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!')
})

const AboutTheCondominiumInformationsTab = () => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema)
    })

    const dispatch = useAppDispatch()

    const { condominium } = useSelector((state: RootState) => state.aboutTheCondominium.data)

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [formDisabled, setFormDisabled] = useState(true)

    const toggleFormDisabled = () => {
        setFormDisabled(!formDisabled)
    }

    const handleCancel = () => {
        toggleFormDisabled()
        reset({
            ...condominium,
            national_corporate_taxpayer_identification_number: addCNPJMask(
                condominium?.national_corporate_taxpayer_identification_number
            )
        })
    }

    const onSubmit = (data: Partial<CondominiumType>) => {
        const formattedData = {
            id: condominium?.id,
            name: data.name,
            description: data.description
        }

        dispatch(patchDataAboutTheCondominiumInfo(formattedData))
        toggleSnackbarHandler()
        toggleFormDisabled()
    }

    const toggleSnackbarHandler = () => setSnackbarOpen(!snackbarOpen)

    useEffect(() => {
        reset({
            ...condominium,
            national_corporate_taxpayer_identification_number: addCNPJMask(
                condominium?.national_corporate_taxpayer_identification_number
            )
        })
    }, [reset, condominium])

    return (
        <CardContent>
            <Grid container spacing={7}>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    disabled={formDisabled}
                                    value={value}
                                    label='Nome'
                                    onChange={onChange}
                                    placeholder='Nome do Condomínio'
                                    error={Boolean(errors.nome)}
                                />
                            )}
                        />
                        {errors.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='national_corporate_taxpayer_identification_number'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <InputMask mask='99.999.999/9999-99' value={value} disabled={true} onChange={onChange}>
                                    {() => (
                                        <TextField
                                            value={value}
                                            label='CNPJ'
                                            placeholder='XXX.XXX/0001-XX'
                                            disabled={true}
                                        />
                                    )}
                                </InputMask>
                            )}
                        />
                    </FormControl>
                </Grid>

                <Grid item sm={12} xs={12}>
                    <FormControl fullWidth>
                        <Controller
                            name='description'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    multiline
                                    minRows={3}
                                    value={value?.slice(0, 512)}
                                    label='Descrição'
                                    onChange={onChange}
                                    placeholder='Descrição do Condomínio'
                                    error={Boolean(errors.descricao)}
                                    disabled={formDisabled}
                                    helperText={
                                        <Box
                                            style={{
                                                float: 'right'
                                            }}
                                        >
                                            {value?.length}/512
                                        </Box>
                                    }
                                />
                            )}
                        />
                        {errors.descricao && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.descricao.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    {formDisabled && (
                        <Button
                            variant='contained'
                            color='primary'
                            sx={{ marginRight: 3.5 }}
                            type='submit'
                            onClick={() => toggleFormDisabled()}
                        >
                            Habilitar Edição
                        </Button>
                    )}
                    {!formDisabled && (
                        <>
                            <ConfirmationDialog
                                title='Atualizar Condomínio'
                                subTitle='Altere o endereço deste Condomínio.'
                                content='Esta ação irá alterar o endereço deste Condomínio e poderá influenciar em documentações em diversos módulos do sistema! Caso tenha certeza, clique em "Atualizar".'
                                onConfirm={onSubmit}
                                render={confirm => (
                                    <Button
                                        variant='contained'
                                        sx={{ marginRight: 3.5 }}
                                        type='submit'
                                        disabled={Object.keys(errors).length !== 0}
                                        onClick={handleSubmit(confirm)}
                                    >
                                        Salvar Alterações
                                    </Button>
                                )}
                            />

                            <Button
                                variant='contained'
                                color='error'
                                type='submit'
                                onClick={() => {
                                    handleCancel()
                                }}
                            >
                                Cancelar
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>

            <SnackbarAlert
                open={snackbarOpen}
                toggle={toggleSnackbarHandler}
                severity={'success'}
                message={'Condomínio atualizado com sucesso!'}
            />
        </CardContent>
    )
}

export default AboutTheCondominiumInformationsTab
