import { useDataEngine } from '@dhis2/app-runtime'
import { QueryCache, QueryClient } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient'
import createIDBPersister from './persister.js'

class CustomQueryCache extends QueryCache {
    remove(...args) {
        console.log('> CustomQueryCache instance', this)
        console.log('> CustomQueryCache remove:', ...args)
        return super.remove(...args)
    }

    clear(...args) {
        console.log('> CustomQueryCache clear:', ...args)
        return super.clear(...args)
    }
}

const queryCache = new CustomQueryCache()
window.queryCache = queryCache

// Persisted data will be garbage collected after this time
const MAX_CACHE_AGE = 1000 * 60 * 60 * 24 * 31 // One month

const useQueryClient = () => {
    const engine = useDataEngine()

    // https://react-query.tanstack.com/guides/query-keys
    const queryFn = ({ queryKey }) => {
        const [resource, { params, id }] = queryKey
        const appRuntimeQuery = {
            [resource]: {
                resource,
                id,
                params,
            },
        }

        return engine.query(appRuntimeQuery).then((data) => data[resource])
    }

    const queryClient = new QueryClient({
        queryCache,
        defaultOptions: {
            queries: {
                queryFn,
                refetchOnWindowFocus: false,
                // Needs to be equal or higher than the persisted cache maxAge
                cacheTime: MAX_CACHE_AGE,
                keepPreviousData: true,
            },
        },
    })
    console.log('> created new query client:', queryClient)

    const persister = createIDBPersister()

    persistQueryClient({
        queryClient,
        persister,
        maxAge: MAX_CACHE_AGE,
        dehydrateOptions: {
            dehydrateMutations: true,
            dehydrateQueries: true,
        },
    })

    return queryClient
}

export default useQueryClient
