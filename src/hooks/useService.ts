import { HomespaceBaseModel } from '@typesApiMapping/apps/core/homeSpaceBaseModelTypes'
import { useEffect, useState } from 'react'
import { DjangoModelViewSetDefaultResponse, ServiceRequest } from 'src/services/Url'

type ItemIdType<T> = T extends Array<infer U> ? (U extends { id: string } ? string : number) : undefined

function useService<UrlParams, T extends HomespaceBaseModel>(
    service: ServiceRequest<UrlParams, T>,
    params?: Partial<UrlParams>,
    dependencies?: Array<any>
): {
    data: T | undefined
}
function useService<UrlParams, T extends HomespaceBaseModel[]>(
    service: ServiceRequest<UrlParams, T>,
    params?: UrlParams,
    dependencies?: Array<any>
): {
    data: T | undefined
    find: (itemId?: ItemIdType<T>) => T extends (infer U)[] ? U : undefined
    findAsync: (itemId?: ItemIdType<T>) => Promise<T extends (infer U)[] ? U : undefined>
}

function useService<UrlParams, T extends HomespaceBaseModel[] | HomespaceBaseModel>(
    service: ServiceRequest<UrlParams, T>,
    params?: UrlParams,
    dependencies?: Array<any>
) {
    const [data, setData] = useState<T>()

    const find = Array.isArray(data)
        ? (itemId: ItemIdType<T>) => {
              if (Array.isArray(data)) {
                  return data.find(item => item.id == itemId) as T extends Array<infer U> ? U : undefined
              }

              return undefined
          }
        : () => data

    const fetchData = async () => {
        try {
            const response = await service.get(params)
            const arrayData = response.data as DjangoModelViewSetDefaultResponse<T>
            if (arrayData.results) {
                setData(arrayData.results)
                return arrayData.results
            }
            setData(response.data as T)
            return response.data as T
        } catch (error) {}
    }

    const findAsync = async (itemId: ItemIdType<T>) => {
        if (Array.isArray(data)) {
            const item = find(itemId)
            if (item) {
                return item
            }
            const data = await fetchData()
            if (!data) {
                return undefined
            }

            if (Array.isArray(data)) {
                return data.find(item => item.id == itemId) as T extends Array<infer U> ? U : undefined
            }
            return data
        }
        return data
    }

    useEffect(() => {
        if (Object.values(params ?? {}).every(value => value !== -1)) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(dependencies ?? [])])

    return { data, find, findAsync }
}

export default useService
