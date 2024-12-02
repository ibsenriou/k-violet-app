import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '.'

export const createAppAsyncThunk = <Returned, ThunkArg = void>(
    typePrefix: string,
    asyncFunction: (arg: ThunkArg, thunkAPI: { dispatch: AppDispatch; getState: () => RootState }) => Promise<Returned>
) => createAsyncThunk<Returned, ThunkArg, { dispatch: AppDispatch; state: RootState }>(typePrefix, asyncFunction)

export const checkMatchType =
    (sliceKey: string, type: 'fulfilled' | 'pending' | 'rejected', ignoreReduceKey: string = '') =>
    (action: any) =>
        action.type.startsWith(`${sliceKey}`) &&
        action.type.endsWith(`/${type}`) &&
        action.type !== `${sliceKey}/${ignoreReduceKey}/${type}`
