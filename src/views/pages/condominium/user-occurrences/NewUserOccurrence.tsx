import DialogComponent from '@core/components/dialog'
import { useForm } from 'react-hook-form'

import LoadingButton from '@core/components/loading-button'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'


import SelectField from '@core/components/inputs/SelectField'
import TextField from '@core/components/inputs/TextField'
import Grid from '@mui/material/Grid'
import useSnackbar from 'src/hooks/useSnackbar'
import { LookupsService } from 'src/services/lookupsService'
import { CondominiumService } from 'src/services/condominiumService'

const schema = yup
    .object({
        title: yup.string().required('Campo obrigatório'),
        description: yup.string().required('Campo obrigatório'),
        privacy: yup.string().oneOf(['public', 'private']).required('Campo obrigatório'),
        fk_lookup_type_of_condominium_user_occurrence: yup.string().required('Campo obrigatório'),
    })
    .required()
export type UserOccurrenceSchemaType = yup.InferType<typeof schema>


type NewUserOccurrenceProps = {
    onCancel: () => void
    onConfirm: () => void
}
function NewUserOccurrence({ onCancel, onConfirm }: NewUserOccurrenceProps) {
    const queryClient = useQueryClient()

    const { error } = useSnackbar()

    const {
      control,
      formState: { errors },
      handleSubmit
  } = useForm<UserOccurrenceSchemaType>({
      defaultValues: {
        title: '',
        description: '',
        privacy: 'public',
      },
      resolver: yupResolver(schema)
  })

  const lookupTypeOfCondominiumUserOccurrenceQuery = useQuery({
    queryKey: ['lookupTypeOfCondominiumUserOccurrence'],
    queryFn: () => LookupsService.lookup_type_of_condominium_user_occurrence.get().then(response => response.data),
    select: response => response.results,
  })

  const lookupTypeOfCondominiumUserOccurrence = lookupTypeOfCondominiumUserOccurrenceQuery.data

  const mutation = useMutation({
    mutationFn: async (data: UserOccurrenceSchemaType) => CondominiumService.condominium_user_occurrence.post(null, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userOccurrences'] })
        onConfirm?.()
    },
    onError: () => {
        error('Erro ao processar os dados. Tente novamente mais tarde.')
    }
})

    return (
        <DialogComponent title='Adicionar Ocorrência' description='Adicionar ocorrência a esse condomínio' onClose={onCancel}>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <Grid container spacing={4} pt={1}>
                  <Grid item xs={12} sm={12}>
                      <TextField
                          label='Título'
                          name='title'
                          control={control}
                          error={errors.title}
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <SelectField
                          label='Tipo'
                          name='fk_lookup_type_of_condominium_user_occurrence'
                          control={control}
                          keyLabel='label'
                          keyValue='value'
                          error={errors.fk_lookup_type_of_condominium_user_occurrence}
                          items={
                            lookupTypeOfCondominiumUserOccurrence?.map(item => ({
                              label: item.description,
                              value: item.id
                            })) || []
                          }
                      />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                      <SelectField
                          label='Visualização'
                          name='privacy'
                          control={control}
                          keyLabel='label'
                          keyValue='value'
                          error={errors.privacy}
                          items={
                            [{
                              label: 'Público',
                              value: 'public'
                            },
                            {
                              label: 'Privado',
                              value: 'private'
                            }]
                          }
                      />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                      <TextField
                          label='Descrição'
                          name='description'
                          control={control}
                          error={errors.description}
                          fullWidth
                          multiline
                      />
                  </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{ marginRight: 1 }}
                    loading={Boolean(mutation?.isPending)}
                    onClick={handleSubmit(data => mutation?.mutate(data))}
                    color={'primary'}
                >
                    {'Salvar'}
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Cancelar
                </Button>
            </DialogActions>
        </DialogComponent>
    )
}

export default NewUserOccurrence
