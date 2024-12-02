import { ChangeEvent, ElementType, forwardRef, ReactElement, Ref, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InputMask from 'react-input-mask'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Close from 'mdi-material-ui/Close'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import useContactInformation from 'src/hooks/useContactInformation'
import useLookup from 'src/hooks/useLookup'

import { useAppDispatch } from 'src/store'
import {
    addEmployee,
    deleteEmployee,
    updateEmployee
} from 'src/store/apps/condominium/residentialDetail'

import { LookupTypeOfContactInformationTypeEnum } from '@typesApiMapping/apps/lookups/lookupTypeOfContactInformationTypes'
import { LookupTypeOfUhabUserRoleEnum } from '@typesApiMapping/apps/lookups/lookupTypeOfUhabUserRoleTypes'
import { EmployeeType } from '@typesApiMapping/apps/people/employeeTypes'
import { PersonContactInformationType } from '@typesApiMapping/apps/people/personContactInformationTypes'

import { LookupsService } from 'src/services/lookupsService'
import { PeopleService } from 'src/services/peopleService'

import {
    addCPFMask,
    getCPFOrCNPJValidationError
} from '@core/utils/validate-national_individual_taxpayer_identification'
import Workdays from '@core/utils/workdays'

import CustomAvatar from '@core/components/mui/avatar'
import { getInitials } from '@core/utils/get-initials'
import useLoading from 'src/hooks/useLoading'
import { useQueryClient } from '@tanstack/react-query'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderadius: theme.shape.borderRadius,
    objectFit: 'cover'
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
        textAlign: 'center',
        marginTop: theme.spacing(4)
    }
}))

interface EmployeeActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: any | {}
    open: boolean
    toggle: () => void
    residentialId: string
}

interface Person {
    id: string
    name: string
    date_of_birth: string
    email: string
    cell_phone_number: string
    avatar_image_file_name: string
    person_contact_information_set: PersonContactInformationType[]
    national_individual_taxpayer_identification: string
}

interface EmployeeData extends Person {
    working_week_days: string
}

const schema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório!'),
    date_of_birth: yup.string().nullable(),
    cell_phone_number: yup.string(),
    email: yup.string().email('E-mail inválido!'),
    national_individual_taxpayer_identification: yup
        .string()
        .required('Este campo é obrigatório!')
        .test('validate-erros', 'CPF inválido', (value, { createError }) => {
            const message = getCPFOrCNPJValidationError(value ?? '')

            return message ? createError({ message }) : true
        })
})

const defaultValues: Omit<EmployeeData, 'working_week_days'> & { working_week_days: Workdays } = {
    id: '0',
    name: '',
    date_of_birth: '',
    email: '',
    cell_phone_number: '',
    avatar_image_file_name: '',
    person_contact_information_set: [],
    national_individual_taxpayer_identification: '',
    working_week_days: new Workdays('0000000')
}

const actionTypeConfig = {
    add: {
        title: 'Adicionar Funcionário',
        content: 'Insira um funcionário nesta Unidade Residencial.'
    },
    edit: {
        title: 'Editar Funcionário',
        content: 'Edite as informações de um funcionário dessa Unidade Residencial.'
    },
    delete: {
        title: 'Remover Funcionário',
        content: 'Remova o funcionário da Unidade Residencial.'
    },
    view: {
        title: 'Visualizar Funcionário',
        content: 'Visualize as informações de um funcionário dessa Unidade Residencial'
    },
    default: {
        title: 'Error - Unknown Action Type',
        content: 'Error - Unknown Action Type'
    }
}

const EmployeeActionsDialog = ({
    actionType,
    actionData,
    open,
    toggle,
    residentialId
}: EmployeeActionsDialogInterface) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        getValues,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    })
    const queryClient = useQueryClient()

    const dispatch = useAppDispatch()

    const [focus, setFocused] = useState(false)
    const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
    const [imageUpload, setImageUpload] = useState<File | string>('')
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false)
    const [disableFields, setDisableFields] = useState<boolean>(false)
    const lastChangedCPF = useRef<string>('')

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    const EnumUhabUserRole = useLookup<LookupTypeOfUhabUserRoleEnum>(LookupsService.lookup_type_of_uhab_user_role)
    const EnumContactInformation = useLookup<LookupTypeOfContactInformationTypeEnum>(
        LookupsService.lookup_type_of_contact_information
    )

    const { id: email_id, description: email } = useContactInformation(
        watch('person_contact_information_set'),
        'E-mail',
        [watch('person_contact_information_set')]
    ) as Partial<PersonContactInformationType>

    const { id: cell_phone_id, description: cell_phone_number } = useContactInformation(
        watch('person_contact_information_set'),
        'Telefone Celular',
        [watch('person_contact_information_set')]
    ) as Partial<PersonContactInformationType>

    const searchCPF = async () => {
        const cpfWithMask = getValues('national_individual_taxpayer_identification')
        const cpf = cpfWithMask.replace(/\D/g, '')

        if (lastChangedCPF.current === cpf) {
            return
        }

        lastChangedCPF.current = cpf ?? ''

        const { data } =
            await PeopleService.get_person_and_active_uhab_user_role_by_uhab_user_role_and_person_identification.get({
                identification: cpf ?? '',
                fk_lookup_type_of_uhab_user_role: EnumUhabUserRole.Employee,
                fk_uhab: residentialId,
                employee: true
            })

        const { person, user_role } = data as { person: EmployeeType; user_role: any }

        if (person) {
            setDisableFields(true)
            reset({
                ...defaultValues,
                ...actionData,
                ...person,
                email: email,
                cell_phone_number: cell_phone_number,
                national_individual_taxpayer_identification: cpfWithMask,
                working_week_days: new Workdays(person.working_week_days)
            })
        } else {
            setDisableFields(false)
            reset({
                ...defaultValues,
                ...actionData,
                name: '',
                date_of_birth: '',
                email: '',
                cell_phone_number: '',
                national_individual_taxpayer_identification: cpfWithMask,
                working_week_days: new Workdays('0000000')
            })
        }

        if (user_role) {
            setDisableSaveButton(true)
        } else {
            setDisableSaveButton(false)
        }
    }

    const onChangeFile = (file: ChangeEvent) => {
        const reader = new FileReader()
        const { files } = file.target as HTMLInputElement

        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result as string)
            reader.readAsDataURL(files[0])

            setImageUpload(files[0])
        }
    }

    const handleResetImage = () => {
        setImgSrc('/images/avatars/1.png')
        setImageUpload('')
    }

    const _onSubmit = async (data: typeof defaultValues): Promise<void> => {
        const commonPayload = {
            id: data.id,
            name: data.name,
            national_individual_taxpayer_identification: data?.national_individual_taxpayer_identification,
            date_of_birth: data.date_of_birth,
            avatar_image_file_name: imageUpload,
            working_week_days: data.working_week_days.getBinary(),
            fk_lookup_type_of_uhab_user_role: EnumUhabUserRole.Employee,
            person_contact_information_set: [
                {
                    id: cell_phone_id,
                    fk_lookup_type_of_contact_information: EnumContactInformation.TelefoneCelular,
                    description: data.cell_phone_number
                },
                {
                    id: email_id,
                    fk_lookup_type_of_contact_information: EnumContactInformation.Email,
                    description: data.email
                }
            ]
        }

        const wrapDispatch = async (action: any): Promise<{ error?: string }> => {
            return new Promise(resolve => {
                dispatch(action).then((resolvedAction: any) => {
                    if ('error' in resolvedAction) {
                        resolve({ error: resolvedAction.error.message })
                    } else {
                        resolve({})
                    }
                })
            })
        }

        const actionDispatchMap = {
            add: () => wrapDispatch(addEmployee(commonPayload)),
            edit: () => wrapDispatch(updateEmployee(commonPayload)),
            delete: () => wrapDispatch(deleteEmployee({id: commonPayload.id})),
            view: () => {} // do nothing
        }

        if (actionType === null) {
            console.error('Unknown action type')

            return
        }

        if (actionType === null) {
            console.error('Unknown action type')

            return
        }

        const dispatchAction = actionDispatchMap[actionType]

        if (!dispatchAction) {
            console.error('Unknown action type')

            return
        }

        const actionResult = await dispatchAction()
        queryClient.invalidateQueries({
          queryKey: ['residential.employees', residentialId]
        })
        if (actionResult && actionResult.error) {
            toast.error(
                'Ocorreu um erro ao realizar a ação. Por favor, tente novamente. Caso problema persista, favor entrar em contato com a nossa equipe de suporte.',
                {
                    position: 'bottom-left',
                    duration: 10000
                }
            )
        } else {
            toast.success('Ação realizada com sucesso!', {
                position: 'bottom-left'
            })
        }

        handleClose()
    }

    const [onSubmit, submitLoading] = useLoading(_onSubmit)

    const handleClose = () => {
        toggle()
        reset()
    }

    useEffect(() => {
        setValue('email', email ?? '')
    }, [email, setValue])

    useEffect(() => {
        setValue('cell_phone_number', cell_phone_number ?? '')
    }, [cell_phone_number, setValue])

    useEffect(() => {
        if (actionType !== 'add') {
            reset({
                ...defaultValues,
                ...actionData,
                email: email ?? '',
                cell_phone_number: cell_phone_number,
                national_individual_taxpayer_identification: addCPFMask(
                    actionData?.national_individual_taxpayer_identification
                ),
                working_week_days: new Workdays(actionData?.working_week_days)
            })
        }
    }, [actionType, actionData, reset, cell_phone_number, email])

    useEffect(() => {
        if (actionType === 'add') {
            reset(defaultValues)
        }
    }, [actionType, reset])

    if (!actionType) return null

    const dialogTitle = actionTypeConfig[actionType]?.title || actionTypeConfig['default'].title
    const dialogContent = actionTypeConfig[actionType]?.content || actionTypeConfig['default'].content

    const cpfLength = watch('national_individual_taxpayer_identification')?.replace(/\D/g, '')?.length ?? 0

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='md'
            scroll='body'
            onClose={() => toggle()}
            TransitionComponent={Transition}
            onBackdropClick={() => toggle()}
        >
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                    size='small'
                    onClick={() => handleClose()}
                    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                    <Close />
                </IconButton>

                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ mb: 3 }}>
                        {dialogTitle}
                    </Typography>
                    <Typography variant='body2'>{dialogContent}</Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    {actionType === 'delete' && (
                        <Alert severity='warning'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Esta ação irá excluir permanentemente o funcionário. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                    {disableSaveButton && (
                        <Alert severity='error'>
                            <AlertTitle>Atenção!</AlertTitle>
                            {`Não é possível adicionar um funcionário que já existe. Esse CPF já está cadastrado.`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'success'}
                                sx={{ width: 120, height: 120, fontWeight: 600, marginBottom: 4, fontSize: '3rem' }}
                            >
                                {getInitials(watch('name') || '')}
                            </CustomAvatar>
                            {/* <ImgStyled src={imgSrc} alt='Profile Pic' />
                            <Box>
                                {actionType === 'view' || actionType === 'delete' ? (
                                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                                        Permitido PNG ou JPEG. Tamanho máximo de 800K.
                                    </Typography>
                                ) : (
                                    <div>
                                        <ButtonStyled
                                            component='label'
                                            variant='contained'
                                            htmlFor='account-settings-upload-image'
                                        >
                                            Adicionar Foto
                                            <input
                                                hidden
                                                type='file'
                                                onChange={onChangeFile}
                                                accept='image/png, image/jpeg'
                                                id='account-settings-upload-image'
                                            />
                                        </ButtonStyled>
                                        <ResetButtonStyled color='error' variant='outlined' onClick={handleResetImage}>
                                            Remover Foto
                                        </ResetButtonStyled>
                                        <Typography variant='body2' sx={{ marginTop: 5 }}>
                                            Permitido PNG ou JPEG. Tamanho máximo de 800K.
                                        </Typography>
                                    </div>
                                )}
                            </Box> */}
                        </Box>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='national_individual_taxpayer_identification'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputMask
                                        mask={'999.999.999-99'}
                                        maskChar=''
                                        value={value}
                                        onChange={onChange}
                                        disabled={
                                            actionType === 'view' || actionType === 'delete' || actionType === 'edit'
                                        }
                                        onBlur={() => {
                                            if (errors.national_individual_taxpayer_identification) return
                                            searchCPF()
                                        }}
                                    >
                                        {() => (
                                            <TextField
                                                label='CPF'
                                                disabled={
                                                    actionType === 'view' ||
                                                    actionType === 'delete' ||
                                                    actionType === 'edit'
                                                }
                                                autoFocus={true}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                        </FormControl>
                        {errors.national_individual_taxpayer_identification && (
                            <FormHelperText error>
                                {errors.national_individual_taxpayer_identification.message}
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Nome'
                                        onChange={onChange}
                                        disabled={
                                            actionType === 'view' ||
                                            actionType === 'delete' ||
                                            actionType === 'edit' ||
                                            disableFields ||
                                            cpfLength < 11
                                        }
                                    />
                                )}
                            />
                        </FormControl>
                        {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='date_of_birth'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        value={value}
                                        type={value || focus ? 'date' : 'text'}
                                        label='Data de Nascimento'
                                        onChange={onChange}
                                        disabled={
                                            actionType === 'view' ||
                                            actionType === 'delete' ||
                                            actionType === 'edit' ||
                                            disableFields ||
                                            cpfLength < 11
                                        }
                                    />
                                )}
                            />
                        </FormControl>
                        {errors.date_of_birth && <FormHelperText error>{errors.date_of_birth.message}</FormHelperText>}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='email'
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        type='email'
                                        label='E-mail'
                                        value={value}
                                        onChange={onChange}
                                        disabled={
                                            actionType === 'view' ||
                                            actionType === 'delete' ||
                                            actionType === 'edit' ||
                                            disableFields ||
                                            cpfLength < 11
                                        }
                                    />
                                )}
                            />
                        </FormControl>
                        {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='cell_phone_number'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputMask
                                        mask='(99) 9 9999-9999'
                                        maskChar=''
                                        value={value || ''}
                                        onChange={onChange}
                                        disabled={
                                            actionType === 'view' ||
                                            actionType === 'delete' ||
                                            actionType === 'edit' ||
                                            disableFields ||
                                            cpfLength < 11
                                        }
                                    >
                                        {() => (
                                            <TextField
                                                label='Telefone Celular'
                                                placeholder='11 999999999'
                                                disabled={
                                                    actionType === 'view' ||
                                                    actionType === 'delete' ||
                                                    actionType === 'edit' ||
                                                    disableFields ||
                                                    cpfLength < 11
                                                }
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                            {errors.cell_phone_number && (
                                <FormHelperText error>{errors.cell_phone_number.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <CardHeader
                            title='Dias de Trabalho'
                            titleTypographyProps={{ variant: 'body1', align: 'center' }}
                        />

                        <Divider sx={{ margin: 0 }} />

                        <TableContainer>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead
                                    sx={{
                                        backgroundColor: theme =>
                                            theme.palette.mode === 'light' ? 'grey.50' : 'background.default'
                                    }}
                                >
                                    <TableRow>
                                        {Object.keys(Workdays.DAYS_TRANSLATION).map(day => (
                                            <TableCell key={day} align='center'>
                                                {
                                                    Workdays.DAYS_TRANSLATION[
                                                        day as keyof typeof Workdays.DAYS_TRANSLATION
                                                    ]
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <Controller
                                        name='working_week_days'
                                        control={control}
                                        render={({ field: { value: workDays, onChange } }) => {
                                            const handleWorkDays =
                                                (day: keyof typeof Workdays.INDEXES) =>
                                                (event: ChangeEvent<HTMLInputElement>) => {
                                                    onChange(workDays.setValue(day, event.target.checked))
                                                }

                                            return (
                                                <TableRow hover>
                                                    {Object.keys(Workdays.DAYS_TRANSLATION).map(day => (
                                                        <TableCell
                                                            key={day}
                                                            align='center'
                                                            sx={{
                                                                paddingTop: '0 !important',
                                                                paddingBottom: '0 !important'
                                                            }}
                                                        >
                                                            <Switch
                                                                value={
                                                                    Workdays.DAYS_TRANSLATION[
                                                                        day as keyof typeof Workdays.DAYS_TRANSLATION
                                                                    ]
                                                                }
                                                                checked={workDays?.getValue(
                                                                    day as keyof typeof Workdays.INDEXES
                                                                )}
                                                                onChange={handleWorkDays(
                                                                    day as keyof typeof Workdays.INDEXES
                                                                )}
                                                                disabled={
                                                                    actionType === 'view' ||
                                                                    actionType === 'delete' ||
                                                                    cpfLength < 11
                                                                }
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            )
                                        }}
                                    />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                {actionType === 'view' ? (
                    <Button variant='outlined' color='secondary' onClick={handleClose}>
                        Cancelar
                    </Button>
                ) : (
                    <div>
                        <Button
                            variant='contained'
                            type='submit'
                            color={actionType === 'delete' ? 'error' : 'primary'}
                            onClick={handleSubmit(onSubmit)}
                            sx={{ marginRight: 1 }}
                            disabled={(actionType === 'add' && disableSaveButton) || submitLoading}
                        >
                            {actionType === 'add' && 'Salvar'}
                            {actionType === 'edit' && 'Atualizar'}
                            {actionType === 'delete' && 'Excluir'}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancelar
                        </Button>
                    </div>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default EmployeeActionsDialog
