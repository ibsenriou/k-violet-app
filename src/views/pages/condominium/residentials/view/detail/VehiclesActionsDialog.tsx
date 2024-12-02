import { forwardRef, ReactElement, Ref, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InputMask from 'react-input-mask'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Close from 'mdi-material-ui/Close'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import useService from 'src/hooks/useService'

import { useAppDispatch } from 'src/store'
import { addVehicle, deleteVehicle, updateVehicle } from 'src/store/apps/condominium/residentialDetail'

import { VehicleType } from '@typesApiMapping/apps/vehicles/vehicleTypes'

import { CoreService } from 'src/services/coreService'
import { VehiclesService } from 'src/services/vehiclesService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useLoading from 'src/hooks/useLoading'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

interface VehiclesActionsDialogInterface {
    actionType: 'add' | 'edit' | 'delete' | 'view' | null
    actionData: VehicleType | undefined
    open: boolean
    toggle: () => void
    residentialId: string
}

const schema = yup.object().shape({
    vehicle_plate: yup
        .string()
        .required('Este campo é obrigatório!')
        .uppercase()
        .length(8, 'O valor da placa deve conter 8 caracteres, incluindo o hífen!'),
    manufacturing_year: yup
        .number()
        .typeError('Este campo é obrigatório!')
        .min(1970, 'Ano de fabricação mínimo é 1970!')
        .max(new Date().getFullYear(), 'Ano de fabricação não pode ser superior ao ano atual!'),
    fk_vehicle_model: yup.string().required('Este campo é obrigatório!'),
    fk_vehicle_manufacturer: yup.string().required('Este campo é obrigatório!'),
    fk_color: yup.string().required('Este campo é obrigatório!')
})

const defaultValues: Partial<VehicleType> & { fk_vehicle_manufacturer: string } = {
    vehicle_plate: '',
    manufacturing_year: new Date().getFullYear().toString(),
    fk_color: '',
    fk_vehicle_model: '',
    fk_vehicle_manufacturer: '',
    fk_residential: ''
}

const VehiclesActionsDialog = ({ actionType, actionData, open, toggle, residentialId }: VehiclesActionsDialogInterface) => {
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const queryClient = useQueryClient()

    const dispatch = useAppDispatch()

    const { data: vehicleColors } = useService(CoreService.color)

    const vehicleManufacturersQuery = useQuery({
        queryKey: ['vehicle_manufacturer'],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => VehiclesService.vehicle_manufacturer.get(),
        select: response => response.data.results
    })
    const vehicleManufacturers = vehicleManufacturersQuery.data

    const vehicleModelsQuery = useQuery({
        queryKey: ['vehicle_manufacturer_models', watch('fk_vehicle_manufacturer')],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () =>
            VehiclesService.vehicle_model_by_manufacturerId.get({
                vehicleManufacturerId: watch('fk_vehicle_manufacturer')
            }),
        select: response => response.data.results,
        enabled: vehicleManufacturersQuery.isSuccess
    })
    const vehicleModels = vehicleModelsQuery.data
    const model = vehicleModels?.find(model => model.id === watch('fk_vehicle_model'))

    const actionTypeConfig = {
        add: {
            title: 'Adicionar Veículo',
            content: 'Insira uma veículo nesta Unidade Residencial.'
        },
        edit: {
            title: 'Editar Veículo',
            content: 'Edite as informações de um veículo dessa Unidade Residencial.'
        },
        delete: {
            title: 'Remover Veículo',
            content: 'Remova o veículo da Unidade Residencial.'
        },
        view: {
            title: 'Visualizar Veículo',
            content: 'Visualize as informações de um veículo dessa Unidade Residencial.'
        },
        default: {
            title: 'Error - Unknown Action Type',
            content: 'Error - Unknown Action Type'
        }
    }

    const _onSubmit = async (data: VehicleType): Promise<void> => {
        const vehiclePlate = data.vehicle_plate.replace('-', '').toUpperCase()

        const vehicleData = {
            id: data.id,
            vehicle_plate: vehiclePlate,
            manufacturing_year: data.manufacturing_year,
            fk_vehicle_model: data.fk_vehicle_model,
            fk_color: data.fk_color,
            fk_residential: data.fk_residential
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
            add: () => wrapDispatch(addVehicle({ ...vehicleData, id: '0' })),
            edit: () => wrapDispatch(updateVehicle(vehicleData)),
            delete: () => wrapDispatch(deleteVehicle({ id: data.id })),
            view: () => Promise.resolve // do nothing,
        }

        if (!actionType) {
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
          queryKey: ['residential.vehicles', residentialId]
        })
        if (actionResult && 'error' in actionResult && actionResult.error) {
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

    function addVehiclePlateMask(plate: string): string {
        const plateWithMask = plate?.replace(/(\w{3})(\w{4})/, '$1-$2')
        return plateWithMask
    }

    useEffect(() => {
        if (actionType !== 'add') {
            reset({
                ...defaultValues,
                ...actionData,
                vehicle_plate: addVehiclePlateMask(actionData?.vehicle_plate || '')
            })
        } else {
            reset(defaultValues)
        }
    }, [actionType, actionData, reset])

    useEffect(() => {
        if (actionType !== 'add') {
            if (model?.fk_vehicle_manufacturer) {
                setValue('fk_vehicle_manufacturer', model?.fk_vehicle_manufacturer)
            }
        }
    }, [actionType, model, actionData, open, setValue])

    if (!actionType) return null

    const dialogTitle = actionTypeConfig[actionType]?.title || actionTypeConfig['default'].title
    const dialogContent = actionTypeConfig[actionType]?.content || actionTypeConfig['default'].content

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
                            {`Esta ação irá excluir permanentemente o veículo. Por favor, verifique se está absolutamente certo disso antes de proceder!`}
                        </Alert>
                    )}
                </Box>

                <Grid container spacing={6}>
                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.vehicle_plate)}>
                            <Controller
                                name='vehicle_plate'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputMask
                                        mask='***-****'
                                        maskChar={null}
                                        value={value}
                                        onChange={onChange}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {() => (
                                            <TextField
                                                value={value}
                                                label='Placa'
                                                onChange={onChange}
                                                placeholder='"ABC-1234" ou "ABC-1A34"'
                                                disabled={actionType === 'view' || actionType === 'delete'}
                                                error={Boolean(errors.vehicle_plate)}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                            {errors.vehicle_plate && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.vehicle_plate.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.manufacturing_year)}>
                            <Controller
                                name='manufacturing_year'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        type='number'
                                        label='Ano de Fabricação'
                                        onChange={onChange}
                                        placeholder='2022'
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                        error={Boolean(errors.manufacturing_year)}
                                    />
                                )}
                            />
                            {errors.manufacturing_year && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.manufacturing_year.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }} error={Boolean(errors.fk_color)}>
                            <InputLabel id='color-select'>Selecione a Cor</InputLabel>
                            <Controller
                                name='fk_color'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required
                                        fullWidth
                                        value={value}
                                        id='color-select'
                                        label='Selecione a Cor'
                                        labelId='color-select'
                                        onChange={onChange}
                                        inputProps={{ placeholder: 'Selecione a Cor' }}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {vehicleColors &&
                                            vehicleColors.map(color => (
                                                <MenuItem key={color.id} value={color.id}>
                                                    {color.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_color && (
                                <FormHelperText sx={{ color: 'error.main' }}>{errors.fk_color.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 6 }} error={Boolean(errors.fk_vehicle_manufacturer)}>
                            <InputLabel id='vehicle_manufacturer-select'>Selecione o Fabricante</InputLabel>
                            <Controller
                                name='fk_vehicle_manufacturer'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required
                                        fullWidth
                                        value={value}
                                        id='vehicle_manufacturer-select'
                                        label='Selecione o Fabricante'
                                        labelId='manufacturer-select'
                                        onChange={e => {
                                            onChange(e)
                                            setValue('fk_vehicle_model', '')
                                        }}
                                        inputProps={{ placeholder: 'Selecione o Fabricante' }}
                                        disabled={actionType === 'view' || actionType === 'delete'}
                                    >
                                        {vehicleManufacturers &&
                                            vehicleManufacturers.map(manufacturing => (
                                                <MenuItem key={manufacturing.id} value={manufacturing.id}>
                                                    {manufacturing.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_vehicle_manufacturer && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.fk_vehicle_manufacturer.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FormControl
                            fullWidth
                            error={Boolean(errors.fk_vehicle_model)}
                            sx={{
                                mb: 6,
                                '& .Mui-error > fieldset': {
                                    borderColor: theme => `${theme.palette.error.main} !important`
                                }
                            }}
                        >
                            <InputLabel id='model-select'>Selecione o Modelo</InputLabel>
                            <Controller
                                name='fk_vehicle_model'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        required
                                        fullWidth
                                        value={value}
                                        id='model-select'
                                        label='Selecione o Modelo'
                                        labelId='model-select'
                                        onChange={onChange}
                                        inputProps={{ placeholder: 'Selecione o Modelo' }}
                                        disabled={
                                            actionType === 'view' ||
                                            actionType === 'delete' ||
                                            watch('fk_vehicle_manufacturer') == ''
                                        }
                                        error={Boolean(errors.fk_vehicle_model)}
                                    >
                                        {vehicleModels &&
                                            vehicleModels.map(models => (
                                                <MenuItem key={models.id} value={models.id}>
                                                    {models.description}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                            />
                            {errors.fk_vehicle_model && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.fk_vehicle_model.message}
                                </FormHelperText>
                            )}
                        </FormControl>
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
                            disabled={submitLoading}
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

export default VehiclesActionsDialog
