// Ignore typescript checks
// @ts-nocheck

import axios from 'axios'

type QueryString = Record<string, string | number | boolean>

export type DjangoModelViewSetDefaultResponse<T> = {
    count: number
    next: string | null
    previous: string | null
    results: T
}

export type Service = {
    [key: string]: Url<any, any> | UrlFunction<any, any>
}

export interface ServiceRequest<UrlParams, ResponseData> {
    get: (
        params?: UrlParams,
        query?: QueryString
    ) => Promise<{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: ResponseData extends Array<infer _> ? DjangoModelViewSetDefaultResponse<ResponseData> : ResponseData
    }>
}

/**
 * A utility class for handling URLs and making API requests.
 *
 * @template UrlParams - Type of URL parameters
 * @template ResponseData - Type of the response data
 */
export class Url<UrlParams, ResponseData> implements ServiceRequest {
    path: string

    /**
     * Constructs an instance of the Url class.
     *
     * @param path - The API endpoint path
     */
    constructor(path: string) {
        this.path = path
    }

    /**
     * Replaces path variables in the URL with actual values from `params`.
     *
     * @param params - The URL parameters
     * @returns The URL with path variables replaced
     * @throws {Error} Throws an error if a required path variable is missing
     */
    private mountPath(params?: UrlParams) {
        if (!params) {
            return this.path
        }

        return this.path.replace(/:(\w+)/g, (_, _key) => {
            const key = _key as keyof UrlParams
            const value = params[key] as string | number | boolean | undefined
            if (value === undefined) {
                throw new Error(`Missing parameter "${_key}"`)
            }

            return value.toString()
        })
    }

    /**
     * Makes a GET request to the API.
     *
     * @param params - The URL parameters
     * @param query - The query string parameters
     * @returns A Promise containing the API response
     */
    async get(params?: UrlParams, query?: QueryString) {
        const path = this.mountPath(params)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return axios.get<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ResponseData extends Array<infer _> ? DjangoModelViewSetDefaultResponse<ResponseData> : ResponseData
        >(path, { params: query })
    }

    /**
     * Makes a POST request to the API.
     *
     * @param params - The URL parameters
     * @param body - The request body
     * @param config - The request config
     * @returns A Promise containing the API response
     */
    post(params: UrlParams, body: any, config?: any) {
        const path = this.mountPath(params)

        return axios.post(path, body, config)
    }

    /**
     * Makes a PUT request to the API.
     *
     * @param params - The URL parameters
     * @param body - The request body
     * @returns A Promise containing the API response
     */
    put(params: UrlParams, body: any) {
        const path = this.mountPath(params)

        return axios.put(path, body)
    }

    /**
     * Makes a DELETE request to the API.
     *
     * @param params - The URL parameters
     * @returns A Promise containing the API response
     */
    delete(params: UrlParams) {
        const path = this.mountPath(params)

        return axios.delete(path)
    }

    /**
     * Makes a PATCH request to the API.
     *
     * @param params - The URL parameters
     * @param body - The request body
     * @param config - The request config
     * @returns A Promise containing the API response
     */
    patch(params: UrlParams, body: any, config?: any) {
        const path = this.mountPath(params)

        return axios.patch<ResponseData extends Array<infer U> ? U : ResponseData>(path, body, config)
    }
}

/**
 * Factory function to create a new Url instance with a "/api" prefix. //TODO: Remove hardcoded /api prefix and use env variable pointing to the API server
 *
 * @template T - Type of URL parameters
 * @template U - Type of the response data
 * @param path - The API endpoint path
 * @returns An instance of the Url class
 */

type UrlFunctionHandler<T, U> = (params: T, query?: QueryString) => Promise<U>

export class UrlFunction<T, U> implements ServiceRequest {
    constructor(private fun: UrlFunctionHandler<T, U>) {}

    async get(params: T, query?: QueryString) {
        const data = await this.fun(params, query)

        return { data }
    }
}

function createUrl<T, U = any>(path: string): Url<T, U>
function createUrl<T, U = any>(handler: UrlFunctionHandler<T, U>): UrlFunction<T, U>
function createUrl<T, U = any>(pathOrHandler: string | UrlFunctionHandler<T, U>): Url<T, U> | UrlFunction<T, U> {
    if (typeof pathOrHandler === 'string') {
        return new Url<T, U>('/api' + pathOrHandler) //TODO: Remove hardcoded /api prefix and use env variable pointing to the API server
    } else if (typeof pathOrHandler === 'function') {
        const handler = pathOrHandler as UrlFunctionHandler<T, U>

        return new UrlFunction<T, U>(handler)
    } else {
        throw new Error('Invalid argument type for pathOrHandler')
    }
}

export { createUrl }
