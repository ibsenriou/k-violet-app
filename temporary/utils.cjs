'use strict'
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __hasOwnProp = Object.prototype.hasOwnProperty
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true })
}
var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, {
                    get: () => from[key],
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                })
    }
    return to
}
var __toCommonJS = mod => __copyProps(__defProp({}, '__esModule', { value: true }), mod)

// src/utils.ts
var utils_exports = {}
__export(utils_exports, {
    addToEnd: () => addToEnd,
    addToStart: () => addToStart,
    functionalUpdate: () => functionalUpdate,
    hashKey: () => hashKey,
    hashQueryKeyByOptions: () => hashQueryKeyByOptions,
    isPlainArray: () => isPlainArray,
    isPlainObject: () => isPlainObject,
    isServer: () => isServer,
    isValidTimeout: () => isValidTimeout,
    keepPreviousData: () => keepPreviousData,
    matchMutation: () => matchMutation,
    matchQuery: () => matchQuery,
    noop: () => noop,
    partialMatchKey: () => partialMatchKey,
    replaceData: () => replaceData,
    replaceEqualDeep: () => replaceEqualDeep,
    shallowEqualObjects: () => shallowEqualObjects,
    sleep: () => sleep,
    timeUntilStale: () => timeUntilStale
})
module.exports = __toCommonJS(utils_exports)
var isServer = typeof window === 'undefined' || 'Deno' in window
function noop() {
    return void 0
}
function functionalUpdate(updater, input) {
    return typeof updater === 'function' ? updater(input) : updater
}
function isValidTimeout(value) {
    return typeof value === 'number' && value >= 0 && value !== Infinity
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0)
}
function matchQuery(filters, query) {
    const { type = 'all', exact, fetchStatus, predicate, queryKey, stale } = filters
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                return false
            }
        } else if (!partialMatchKey(query.queryKey, queryKey)) {
            return false
        }
    }
    if (type !== 'all') {
        const isActive = query.isActive()
        if (type === 'active' && !isActive) {
            return false
        }
        if (type === 'inactive' && isActive) {
            return false
        }
    }
    if (typeof stale === 'boolean' && query.isStale() !== stale) {
        return false
    }
    if (typeof fetchStatus !== 'undefined' && fetchStatus !== query.state.fetchStatus) {
        return false
    }
    if (predicate && !predicate(query)) {
        return false
    }
    return true
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters
    if (mutationKey) {
        if (!mutation.options.mutationKey) {
            return false
        }
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
                return false
            }
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
            return false
        }
    }
    if (status && mutation.state.status !== status) {
        return false
    }
    if (predicate && !predicate(mutation)) {
        return false
    }
    return true
}
function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashKey
    return hashFn(queryKey)
}
function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val) =>
        isPlainObject(val)
            ? Object.keys(val)
                  .sort()
                  .reduce((result, key) => {
                      result[key] = val[key]
                      return result
                  }, {})
            : val
    )
}
function partialMatchKey(a, b) {
    if (a === b) {
        return true
    }
    if (typeof a !== typeof b) {
        return false
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        return !Object.keys(b).some(key => !partialMatchKey(a[key], b[key]))
    }
    return false
}
function replaceEqualDeep(a, b) {
    if (a === b) {
        return a
    }
    const array = isPlainArray(a) && isPlainArray(b)
    if (array || (isPlainObject(a) && isPlainObject(b))) {
        const aItems = array ? a : Object.keys(a)
        const aSize = aItems.length
        const bItems = array ? b : Object.keys(b)
        const bSize = bItems.length
        const copy = array ? [] : {}
        let equalItems = 0
        for (let i = 0; i < bSize; i++) {
            const key = array ? i : bItems[i]
            if (!array && a[key] === void 0 && b[key] === void 0 && aItems.includes(key)) {
                copy[key] = void 0
                equalItems++
            } else {
                copy[key] = replaceEqualDeep(a[key], b[key])
                if (copy[key] === a[key] && a[key] !== void 0) {
                    equalItems++
                }
            }
        }
        return aSize === bSize && equalItems === aSize ? a : copy
    }
    return b
}
function shallowEqualObjects(a, b) {
    if ((a && !b) || (b && !a)) {
        return false
    }
    for (const key in a) {
        if (a[key] !== b[key]) {
            return false
        }
    }
    return true
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length
}
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false
    }
    const ctor = o.constructor
    if (typeof ctor === 'undefined') {
        return true
    }
    const prot = ctor.prototype
    if (!hasObjectPrototype(prot)) {
        return false
    }
    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false
    }
    return true
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === 'function') {
        return options.structuralSharing(prevData, data)
    } else if (options.structuralSharing !== false) {
        return replaceEqualDeep(prevData, data)
    }
    return data
}
function keepPreviousData(previousData) {
    return previousData
}
function addToEnd(items, item, max = 0) {
    const newItems = [...items, item]
    return max && newItems.length > max ? newItems.slice(1) : newItems
}
function addToStart(items, item, max = 0) {
    const newItems = [item, ...items]
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
    (module.exports = {
        addToEnd,
        addToStart,
        functionalUpdate,
        hashKey,
        hashQueryKeyByOptions,
        isPlainArray,
        isPlainObject,
        isServer,
        isValidTimeout,
        keepPreviousData,
        matchMutation,
        matchQuery,
        noop,
        partialMatchKey,
        replaceData,
        replaceEqualDeep,
        shallowEqualObjects,
        sleep,
        timeUntilStale
    })
//# sourceMappingURL=utils.cjs.map
