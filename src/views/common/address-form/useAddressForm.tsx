import { useQuery } from '@tanstack/react-query'
import { AddressType } from '@typesApiMapping/apps/core/addressTypes'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import useSnackbar from 'src/hooks/useSnackbar'
import { CoreService } from 'src/services/coreService'

type useAddressFormProps = {
    postal_code_number?: string
    address?: AddressType | null
    reset?: (data?: { [key: string]: string | undefined }) => void
    onChange?: (data: {
        street_name?: string
        number?: string
        complement?: string
        fk_postal_code?: string
        fk_state?: string
        fk_city?: string
        fk_district?: string
    }) => Promise<void>
}

function useAddressForm({ postal_code_number, address, reset, onChange }: useAddressFormProps) {
    const [formDisabled, setFormDisabled] = useState(true)
    const [postalCodeSearch, setPostalCodeSearch] = useState(postal_code_number)
    const { error } = useSnackbar()

    useEffect(() => {
        setPostalCodeSearch('')
    }, [postal_code_number])

    const addressPostalCodeQuery = useQuery({
        queryKey: ['postalCodeSearch', address?.fk_postal_code],
        retry(failureCount, error: AxiosError) {
            return failureCount < 2 && error.response?.status !== 404
        },
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            const response = await CoreService.postal_codeId.get({ postalCodeId: address?.fk_postal_code || '' })
            return response.data
        }
    })

    const searchPostalCodeQuery = useQuery({
        queryKey: ['postalCodeSearch', postalCodeSearch],
        retry(failureCount, error: AxiosError) {
            return failureCount < 2 && error.response?.status !== 404
        },
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) {
                return null
            }
            const postal_code_number = queryKey[1]
            const response = await CoreService.get_postal_codeId_by_postal_code_number.get(null, {
                postal_code_number: (postal_code_number || '').replace(/\D/g, '')
            })
            return response.data.results[0]
        }
    })

    useEffect(() => {
        if (searchPostalCodeQuery.isPending) {
            return
        }
        if (searchPostalCodeQuery.data) {
            reset?.({
                postal_code_number: searchPostalCodeQuery.data?.postal_code_number || '',
                street_name: searchPostalCodeQuery.data?.street_name || '',
                number: '',
                complement: '',
                fk_district: searchPostalCodeQuery.data?.fk_district || ''
            })
        } else {
            reset?.({
                postal_code_number: addressPostalCodeQuery.data?.postal_code_number || '',
                street_name: addressPostalCodeQuery.data?.street_name || address?.street_name || '',
                number: address?.number || '',
                complement: address?.complement || '',
                fk_district: addressPostalCodeQuery.data?.fk_district || address?.fk_district || ''
            })
        }
    }, [
        searchPostalCodeQuery.data,
        addressPostalCodeQuery.dataUpdatedAt,
        searchPostalCodeQuery.isPending,
        postalCodeSearch
    ])
    const postalCodeQuery =
        searchPostalCodeQuery.data || searchPostalCodeQuery.isPending ? searchPostalCodeQuery : addressPostalCodeQuery

    const districtQuery = useQuery({
        queryKey: ['district', postalCodeQuery.data?.fk_district, postalCodeQuery.data?.fk_city],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: async () => {
            if (postalCodeQuery.data?.fk_district) {
                const response = await CoreService.districtId.get({
                    districtId: postalCodeQuery.data?.fk_district || ''
                })
                return [response.data]
            } else {
                const response = await CoreService.district.get(null, {
                    fk_city: postalCodeQuery.data?.fk_city || ''
                })
                return response.data.results
            }
        },
        enabled: Boolean(postalCodeQuery.data) && !postalCodeQuery.isLoading
    })

    const cityQuery = useQuery({
        queryKey: ['city', postalCodeQuery.data?.fk_city],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => CoreService.cityId.get({ cityId: postalCodeQuery.data?.fk_city || '' }),
        select: response => response.data,
        enabled: Boolean(postalCodeQuery.data?.fk_city) && !postalCodeQuery.isLoading
    })

    const stateQuery = useQuery({
        queryKey: ['state', cityQuery.data?.fk_state],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => CoreService.stateId.get({ stateId: cityQuery.data?.fk_state || '' }),
        select: response => response.data,
        enabled: Boolean(cityQuery.data?.fk_state) && !cityQuery.isLoading
    })

    const searchPostalCode = () => {
        const postal_code_without_mask = (postal_code_number || '').replace(/\D/g, '')

        if (postal_code_without_mask?.length != 8) {
            return
        }

        setPostalCodeSearch(postal_code_without_mask)
        reset?.({
            number: '',
            complement: '',
            street_name: '',
            district_name: ''
        })
    }

    const handleSave = (formData: {
        number: string
        postal_code_number: undefined
        complement: string
        street_name: string
        fk_district: string
    }) => {
        return onChange?.({
            street_name: formData.street_name,
            number: formData.number,
            complement: formData.complement,
            fk_postal_code: postalCodeQuery.data?.id,
            fk_state: stateQuery.data?.id,
            fk_city: postalCodeQuery.data?.fk_city,
            fk_district: formData.fk_district
        }).then(() => {
            reset?.({
                postal_code_number: postal_code_number || '',
                street_name: formData.street_name || '',
                number: formData.number,
                complement: formData.complement,
                fk_district: formData.fk_district || ''
            })
            setFormDisabled(true)
        })
    }

    const editAddress = () => {
        setFormDisabled(false)
    }

    const cancelEdit = () => {
        setFormDisabled(true)
        if (addressPostalCodeQuery.isSuccess) {
            reset?.({
                postal_code_number: addressPostalCodeQuery.data?.postal_code_number || '',
                street_name: addressPostalCodeQuery.data?.street_name || address?.street_name || '',
                number: address?.number || '',
                complement: address?.complement || '',
                fk_district: addressPostalCodeQuery.data?.fk_district || address?.fk_district || ''
            })
        }
        setPostalCodeSearch(undefined)
    }

    useEffect(() => {
        if (searchPostalCodeQuery.isError) {
            error('CEP não encontrado. Entre em contato com o suporte.')
            setPostalCodeSearch('')
        }
    }, [searchPostalCodeQuery.isError])

    return {
        searchPostalCode,
        districtQuery,
        cityQuery,
        stateQuery,
        postalCodeQuery,
        handleSave,
        formDisabled,
        editAddress,
        cancelEdit
    }
}

export default useAddressForm
