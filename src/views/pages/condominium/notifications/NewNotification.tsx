import TextEditor from '@core/components/text-editor/TextEditor'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LookupsService } from 'src/services/lookupsService'
import {
    LookupTypeOfUhabUserRoleEnum,
    LookupTypeOfUhabUserRoleType
} from '@typesApiMapping/apps/lookups/lookupTypeOfUhabUserRoleTypes'
import useFileSelector from 'src/hooks/useFileSelector'
import formatter from '@core/utils/formatter'
import useFileDownloader from 'src/hooks/useFileDownloader'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { NotificationService } from 'src/services/notificationService'
import useSnackbar from 'src/hooks/useSnackbar'

const theme = createTheme({
    palette: {
        mode: 'light'
    }
})

const LOOKUP_TRANSLATIONS: LookupTypeOfUhabUserRoleEnum = {
    Proprietary: 'Proprietários',
    Employee: '',
    Resident: 'Moradores',
    Renter: 'Locatários',
    Syndicator: ''
}

const formatFileSize = formatter('fileSize')
function Attachment({ file, onDelete }: { file: File; onDelete: (file: File) => void }) {
    const download = useFileDownloader()

    return (
        <Box
            display='flex'
            alignItems='center'
            style={{ backgroundColor: '#e8e8ff', padding: '0px 8px', width: '400px' }}
        >
            <Box display='flex' gap={2} style={{ fontSize: '14px' }}>
                <Box
                    onClick={() => download(file)}
                    style={{
                        color: 'blue',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '250px',
                        fontWeight: 'bold'
                    }}
                >
                    {file.name}
                </Box>
                <Box style={{ width: '85px' }}>
                    {'('}
                    {formatFileSize(file.size)}
                    {')'}
                </Box>
            </Box>
            <IconButton onClick={() => onDelete(file)}>
                <CloseIcon />
            </IconButton>
        </Box>
    )
}

type NotificationForm = {
    to_type_of_uhab_user_role: LookupTypeOfUhabUserRoleType[]
    subject: string
    content: string
    attachments: File[]
}

type NewNotificationProps = {
    onCancel: () => void
    onConfirm: () => void
}

function NewNotification({ onCancel, onConfirm }: NewNotificationProps) {
    const queryClient = useQueryClient()
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        register,
        formState: { errors }
    } = useForm<NotificationForm>({
        defaultValues: {
            to_type_of_uhab_user_role: [],
            subject: '',
            content: '',
            attachments: []
        }
    })

    const { success, error } = useSnackbar()

    const selectFile = useFileSelector({
        onSelected: files => {
            const oldFiles = watch('attachments') || []
            setValue('attachments', [...oldFiles, ...files])
        },
        accept: '*',
        multiple: true
    })

    const lookup_type_of_uhab_user_role = useQuery({
        queryKey: ['type_of_uhab_user_role'],
        queryFn: () => {
            return LookupsService.lookup_type_of_uhab_user_role.get()
        },
        select: response =>
            response.data.results.filter(
                (role: LookupTypeOfUhabUserRoleType) => !['Syndicator', 'Employee'].includes(role.description)
            ),
        staleTime: 1000 * 60 * 60 * 24
    })

    function handleSendEmail(data: NotificationForm) {
        const body = {
            to_type_of_uhab_user_role: data.to_type_of_uhab_user_role.map(role => role.id),
            subject: data.subject,
            content: data.content,
            type_of_notification: 'NOTIFICATION'
        }
        return NotificationService.send_email.post(null, body)
    }

    const mutation = useMutation({
        mutationFn: handleSendEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            onConfirm()
            success('Comunicado enviado com sucesso')
        },
        onError: () => {
            error('Erro ao enviar comunicado')
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <Dialog scroll='body' open onClose={onCancel} maxWidth='xl' fullWidth>
                <DialogTitle sx={{ m: 0, p: '1.25rem', display: 'grid', gap: 1 }} id='customized-dialog-title'>
                    <Box display={'flex'} alignItems='center'>
                        <Controller
                            name='to_type_of_uhab_user_role'
                            control={control}
                            rules={{ required: 'Campo obrigatório' }}
                            render={({ field }) => (
                                <Autocomplete
                                    onBlur={field.onBlur}
                                    onChange={(e, value) => field.onChange(value)}
                                    size='small'
                                    sx={{ flexGrow: 1 }}
                                    value={field.value}
                                    multiple
                                    options={lookup_type_of_uhab_user_role.data || []}
                                    groupBy={() => 'Grupos'}
                                    getOptionLabel={(option: LookupTypeOfUhabUserRoleType) =>
                                        LOOKUP_TRANSLATIONS[option.description]
                                    }
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            name={field.name}
                                            variant='standard'
                                            label='Para'
                                            sx={{ flexGrow: 1 }}
                                            helperText={
                                                (errors['to_type_of_uhab_user_role'] as unknown as FieldError)?.message
                                            }
                                            error={!!errors['to_type_of_uhab_user_role']}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Box>
                            <IconButton
                                name='close-button'
                                aria-label='close'
                                onClick={onCancel}
                                sx={{
                                    color: theme => theme.palette.grey[500]
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Controller
                        name='subject'
                        control={control}
                        rules={{ required: 'Campo obrigatório' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size='small'
                                variant='standard'
                                label='Assunto'
                                error={!!errors['subject']}
                                helperText={errors['subject']?.message}
                            />
                        )}
                    />
                </DialogTitle>
                <DialogContent
                    style={{
                        position: 'relative'
                    }}
                    sx={{
                        '& .tox-statusbar': {
                            display: 'none !important'
                        },
                        '& .tox-tinymce': {
                            border: 'none',
                            borderRadius: '2px',
                            boxShadow: theme => theme.shadows[1]
                        },
                        '& .tox-edit-area__iframe': {
                            paddingBottom: `${(watch('attachments')?.length || 0) * 50}px !important}`
                        }
                    }}
                >
                    <Box height='calc(100vh - 280px)'>
                        <TextEditor
                            toobarSelector='.notification-toolbar'
                            mode={'inline'}
                            onChange={content => setValue('content', content)}
                        />
                        <Box
                            display='flex'
                            flexDirection='column'
                            gap={1}
                            style={{
                                position: 'absolute',
                                bottom: '70px',
                                left: '30px',
                                right: '0',
                                padding: '8px'
                            }}
                        >
                            {watch('attachments')?.map((file: File) => (
                                <Attachment
                                    key={file.name}
                                    file={file}
                                    onDelete={file =>
                                        setValue(
                                            'attachments',
                                            watch('attachments').filter((f: File) => f != file)
                                        )
                                    }
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {/* <IconButton onClick={selectFile}>
                        <AttachFile />
                    </IconButton> */}
                    <Button
                        onClick={handleSubmit(data => mutation.mutate(data))}
                        variant='contained'
                        color='primary'
                        disabled={mutation.isPending}
                        endIcon={mutation.isPending ? <CircularProgress size={20} /> : undefined}
                    >
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

export default NewNotification
